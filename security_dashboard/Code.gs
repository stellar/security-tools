
/**
 * @OnlyCurrentDoc
 *
 * The above comment directs App Script to limit the scope of authorization
 * to only the current spreadsheet.
 */

// --- CONFIGURATION ---
// Go to Script Editor -> Project Settings -> Script Properties and add the following:
// GITHUB_ENTERPRISE_URL: Your GitHub Enterprise URL (e.g., https://github.yourcompany.com)
// GITHUB_ORG: The name of your GitHub organization.
// GITHUB_TOKEN: Your GitHub Personal Access Token with 'repo' and 'read:org' scopes.
// SHEET_ID: The ID of your Google Sheet.
// SHEET_NAME: The name of the sheet/tab where data will be imported.

//Data Normalization Constants
const SEV_CRITICAL = 'Critical';
const SEV_HIGH = 'High';
const SEV_MODERATE = 'Moderate';
const SEV_LOW = 'Low';

/**
 * Creates a custom menu in the spreadsheet to run the importer.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('GitHub Vulnerabilities')
    .addItem('Import All GH Vulnerability Data', 'importVulnerabilitiesToSheet')
    .addItem('Import GH Dependabot Vulnerabilities', 'importDependabotVulnerabilitiesToSheet')
    .addItem('Import GH Secrets Scanning Vulnerabilities', 'importSecretScanningVulnerabilitiesToSheet')
    .addItem('Import GH CodeScanning Vulnerabilities', 'importCodeScanningVulnerabilitiesToSheet')
    .addToUi();
}

/**
 * Fetches the script properties set by the user.
 * @returns {object} The script properties.
 */
function getScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  const githubEnterpriseUrl = properties.getProperty('GITHUB_ENTERPRISE_URL');
  const githubOrg = properties.getProperty('GITHUB_ORG');
  const githubToken = properties.getProperty('GITHUB_TOKEN');
  const sheetId = properties.getProperty('SHEET_ID');
  const dependabotSheetName = properties.getProperty('GH_DEPENDABOT_SHEET_NAME');
  const secretsScanningSheetName = properties.getProperty('GH_SECRETSSCANNING_SHEET_NAME');
  const codeScanningSheetName = properties.getProperty('GH_CODESCANNING_SHEET_NAME');

  if (!githubEnterpriseUrl || !githubOrg || !githubToken || !sheetId || !dependabotSheetName || !secretsScanningSheetName || !codeScanningSheetName) {
    throw new Error("One or more script properties are not set. Please configure them in Project Settings.");
  }

  return { githubEnterpriseUrl, githubOrg, githubToken, sheetId, dependabotSheetName, secretsScanningSheetName, codeScanningSheetName };
}

/**
 * Fetches all repositories for the configured GitHub organization.
 * @param {string} apiUrl - The GitHub GraphQL API endpoint.
 * @param {string} orgName - The name of the organization.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Array} A list of repository names.
 */
//
function getOrgRepositories(apiUrl, orgName, token) {
  const query = `
    query($org: String!, $cursor: String) {
      organization(login: $org) {
        repositories(first: 100, isArchived: false, after: $cursor) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            name
            isArchived
          }
        }
      }
    }
  `;

  let repositories = [];
  let hasNextPage = true;
  let cursor = null;
  const ui = SpreadsheetApp.getUi();

  while (hasNextPage) {
    const variables = { org: orgName, cursor: cursor };
    const payload = JSON.stringify({ query, variables });
    const options = {
      'method': 'POST',
      'contentType': 'application/json',
      'headers': {
        'Authorization': `Bearer ${token}`
      },
      'payload': payload,
      'muteHttpExceptions': true
    };
    //ui.alert("pre-fetch");
    //apiUrl="https://api.github.com/graphql";
    const response = UrlFetchApp.fetch(apiUrl, options);
    //ui.alert(response.getContentText());
    //Bug catching---
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    // Check for non-200 HTTP status codes
    if (responseCode !== 200) {
      Logger.log(`GitHub API request failed in getOrgRepositories. Status: ${responseCode}. Body: ${responseBody}`);
      // Try to parse the error for a better message
      let detailedError = `Status code ${responseCode}.`;
      try {
        const errorResult = JSON.parse(responseBody);
        if (errorResult.message) {
          detailedError += ` Message: ${errorResult.message}`;
        }
      } catch (e) {
        // Body is not JSON, just show the raw body
        detailedError += ` Response: ${responseBody}`;
      }
      const errorMessage = `GitHub API request failed. ${detailedError} Check Logs and Script Properties.`;
      ui.alert('GitHub API Error', errorMessage, ui.ButtonSet.OK);
      throw new Error(errorMessage);
    }
    
    const result = JSON.parse(response.getContentText());

    if (result.errors) {
      ui.alert('GitHub API Error', result.errors[0].message, ui.ButtonSet.OK);
      throw new Error(result.errors[0].message);
    }
    
    //End of bug catching---
    const data = result.data.organization.repositories;
    repositories = repositories.concat(data.nodes.map(repo => repo.name));
    hasNextPage = data.pageInfo.hasNextPage;
    cursor = data.pageInfo.endCursor;
  }
  
  return repositories;
}


/**
 * Fetches vulnerability alerts for a specific repository.
 * @param {string} apiUrl - The GitHub GraphQL API endpoint.
 * @param {string} orgName - The name of the organization.
 * @param {string} repoName - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Array} A list of vulnerability alert objects.
 */
function getVulnerabilitiesForRepo(apiUrl, orgName, repoName, token) {
  const query = `
    query($org: String!, $repo: String!, $cursor: String) {
      repository(owner: $org, name: $repo) {
        vulnerabilityAlerts(first: 100, after: $cursor) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            createdAt
            autoDismissedAt
            dismissedAt
            dismissComment
            dismisser {
              name
            }
            dismissReason
            fixedAt
            state
            number
            securityVulnerability {
              package {
                name
              }
              severity
              advisory {
                summary
                ghsaId
              }
            }
            vulnerableManifestFilename
            vulnerableManifestPath
            vulnerableRequirements
          }
        }
      }
    }
  `;

  let vulnerabilities = [];
  let hasNextPage = true;
  let cursor = null;
  const ui = SpreadsheetApp.getUi();

  while (hasNextPage) {
    const variables = { org: orgName, repo: repoName, cursor: cursor };
    const payload = JSON.stringify({ query, variables });

    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'headers': {
        'Authorization': `Bearer ${token}`
      },
      'payload': payload,
      'muteHttpExceptions': true
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.errors) {
       // It's possible the repo has no vulnerability alerts enabled, so we log instead of stopping.
      console.log(`Could not fetch vulnerabilities for ${repoName}: ${result.errors[0].message}`);
      return [];
    }

    if (!result.data.repository || !result.data.repository.vulnerabilityAlerts) {
      console.log(`No vulnerability alerts found or feature not enabled for ${repoName}.`);
      return [];
    }
    
    const data = result.data.repository.vulnerabilityAlerts;
    vulnerabilities = vulnerabilities.concat(data.nodes);
    hasNextPage = data.pageInfo.hasNextPage;
    cursor = data.pageInfo.endCursor;
  }

  return vulnerabilities;
}


/**
 * Main function to import vulnerabilities into the Google Sheet.
 */
function importVulnerabilitiesToSheet() {
  importDependabotVulnerabilitiesToSheet();
  importSecretScanningVulnerabilitiesToSheet();

}

function importDependabotVulnerabilitiesToSheet() {
  const ui = SpreadsheetApp.getUi();
  try {
    const { githubEnterpriseUrl, githubOrg, githubToken, sheetId, dependabotSheetName, secretsScanningSheetName, codeScanningSheetName } = getScriptProperties();
    //const apiUrl = `${githubEnterpriseUrl}/api/graphql`;
    const apiUrl = `https://api.github.com/graphql`;

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Starting vulnerability import...</p><p>Fetching repositories...</p>').setTitle('Import Progress'));

    const repositories = getOrgRepositories(apiUrl, githubOrg, githubToken);
    //ui.showSidebar(HtmlService.createHtmlOutput('here with' + repositories.length + ' repos right after finding them!'));
    if (repositories.length === 0) {
      ui.alert('No repositories found in the organization.');
      return;
    }
    
    let allVulnerabilities = [];
    //ui.alert('here with' + repositories.length + ' repos!');
    //ui.showSidebar(HtmlService.createHtmlOutput('here with' + repositories.length + ' repos!'));
    //var progressHtml = '';
    for (let i = 0; i < repositories.length; i++) {
    //for (let i = 0; i < 15; i++) {
        const repoName = repositories[i];
        const progressHtml = `<p>Processing repo ${i + 1} of ${repositories.length}: ${repoName}</p>`;
        ui.showSidebar(HtmlService.createHtmlOutput(progressHtml).setTitle('Import Progress'));

        const vulnerabilities = getVulnerabilitiesForRepo(apiUrl, githubOrg, repoName, githubToken);
        vulnerabilities.forEach(vuln => {
            allVulnerabilities.push([
                "PlaceholderProjectName",
                repoName,
                vuln.securityVulnerability.package.name,
                vuln.securityVulnerability.severity,
                vuln.securityVulnerability.advisory.summary,
                new Date(vuln.createdAt),
                new Date(vuln.autoDismissedAt),
                new Date(vuln.dismissedAt),
                vuln.dismissComment,
                (vuln.dismisser==null)?"":vuln.dismisser.name,
                vuln.dismissReason,
                new Date (vuln.fixedAt),
                vuln.state,
                vuln.securityVulnerability.advisory.ghsaId,
                "https://github.com/stellar/"+repoName+"/security/dependabot/"+vuln.number,
                vuln.vulnerableManifestFilename,
                vuln.vulnerableManifestPath,
                "'"+vuln.vulnerableRequirements,
                "Placeholder - Days Open",
                "Placeholder - Remediation Deadline",
                "GitHub Vulnerabilities (Dependabot)"
            ]);
        });
    }

    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(dependabotSheetName);
    
    if (!sheet) {
        throw new Error(`Sheet with name "${dependabotSheetName}" not found.`);
    }

    // Clear existing data and set headers
    sheet.clear();
    const headers = ['Project Name','Repository', 'Package', 'Severity', 'Summary', 'Created At', 'Auto Dismissed At', 'Dismissed At', 'Dismiss Comment', 'Dismisser Name', 'Dismiss Reason', 'FixedAt', 'Status', 'GHSA ID', 'Repo Link', 'Vulnerable Filename', 'Vulnerable Filepath', 'Vulnerable Requirements', 'Days Opened', 'Remediation Deadline', 'Source'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    const COL_DP_PROJECT_NAME = 1;
    const COL_DP_REPOSITORY = 2;
    const COL_DP_PACKAGE = 3;
    const COL_DP_SEVERITY = 4;
    const COL_DP_SUMMARY = 5;
    const COL_DP_CREATED_AT = 6;
    const COL_DP_AUTO_DISMISSED_AT = 7;
    const COL_DP_DISMISSED_AT = 8;
    const COL_DP_DISMISS_COMMENT = 9;
    const COL_DP_DISMISSER_NAME = 10;
    const COL_DP_DISMISS_REASON = 11;
    const COL_DP_FIXED_AT = 12;
    const COL_DP_STATUS = 13;
    const COL_DP_GHSA_ID = 14;
    const COL_DP_REPO_LINK = 15;
    const COL_DP_VULNERABLE_FILENAME = 16;
    const COL_DP_VULNERABLE_FILEPATH = 17;
    const COL_DP_VULNERABLE_REQUIREMENTS = 18;
    const COL_DP_DAYS_OPENED = 19;
    const COL_DP_REMEDIATION_DEADLINE = 20;
    const COL_DP_SOURCE = 21;



    if (allVulnerabilities.length > 0) {
      sheet.getRange(2, 1, allVulnerabilities.length, headers.length).setValues(allVulnerabilities);

      //Set Project Repo Mapping
      sheet.getRange(2,COL_DP_PROJECT_NAME,allVulnerabilities.length,1).setFormulaR1C1("=If(isna(xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C2:R300C2,\'Project-Repo Mappings\'!R1C1:R300C1)),\"\",xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C2:R300C2,\'Project-Repo Mappings\'!R1C1:R300C1))");   //Set reference formulas for calculated data - Project name lookup

      //Set Days Opened calculation - =If(Not(isBlank(H2)),datedif(F2,H2,"D"),If(Not(isBlank(L2)),datedif(F2,L2,"D"),If(Not(isBlank(G2)),datedif(F2,G2,"D"), datedif(F2,today(),"D"))))
      sheet.getRange(2,COL_DP_DAYS_OPENED,allVulnerabilities.length,1).setFormulaR1C1('=If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-13],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-7])),datedif(R[0]C[-13],R[0]C[-7],"D"),If(Not(isBlank(R[0]C[-12])),datedif(R[0]C[-13],R[0]C[-12],"D"),datedif(R[0]C[-13],today(),"D"))))');

      //Set Remediation Deadline Calculation - =F2+XLOOKUP(D2,RemediationPolicyTimelines!$A$1:$A$4,RemediationPolicyTimelines!$B$1:$B$4)
      sheet.getRange(2,COL_DP_REMEDIATION_DEADLINE,allVulnerabilities.length,1).setFormulaR1C1('=R[0]C[-14]+XLOOKUP(R[0]C[-16],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)');
    }

    //DATA CLEANUP
    startRow = 2;
    lastRow = allVulnerabilities.length
    //var valueToDelete = new Date('12/31/1969 19:00:00');
    //var valueToDelete = new Date('');
    var valueToDelete = new Date(null);

    //Clear out any default blank dates in 'Auto Dismissed At' Column
    columnNumber = COL_DP_AUTO_DISMISSED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }

    
    //Clear out any default blank dates in 'Dismissed At' Column
    columnNumber = COL_DP_DISMISSED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      //ui.alert('SS value'+ values[i][0] + '   ::    Compares to ' + valueToDelete);
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();  //i+startRow since we are offsetting from the start row
      }
    }

    //Clear out any default blank dates in 'Fixed At' Column
    columnNumber = COL_DP_FIXED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }

    //Set Custom Formulas for this import 

    
    ui.showSidebar(HtmlService.createHtmlOutput('<p>Import complete!</p>').setTitle('Import Progress'));
    ui.alert('Success', 'Vulnerability data has been imported successfully.', ui.ButtonSet.OK);

  } catch (e) {
    ui.alert('Error', e.message, ui.ButtonSet.OK);
    Logger.log(e.toString());
  }
}

function sheetName() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
}

function testDates() {
  var myDateToDelete = new Date(null);
  //return myDateToDelete;
}
