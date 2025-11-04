/**
 * Fetches vulnerability alerts for a specific repository.
 * @param {string} secretsAPIUrl - The GitHub GraphQL API endpoint.
 * @param {string} orgName - The name of the organization.
 * @param {string} repoName - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Array} A list of vulnerability alert objects.
 */
function getSecretsVulnerabilitiesForOrg(orgName, token) {
  let secretsAPIUrl = "https://api.github.com/orgs/"+orgName+"/secret-scanning/alerts";
  let vulnerabilities = [];
  let hasNextPage = true;
  let cursor = null;
  const ui = SpreadsheetApp.getUi();

  //while (hasNextPage) {
    //const variables = { org: orgName, repo: repoName, cursor: cursor };
    //const payload = JSON.stringify({ query, variables });

    const options = {
      'method': 'get',
      'contentType': 'application/json',
      'headers': {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      
      'muteHttpExceptions': true
    };

    const response = UrlFetchApp.fetch(secretsAPIUrl, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    Logger.log(responseBody);
    //ui.alert(responseBody);
    
    
    if (responseCode !== 200) {
      // Log the error response from GitHub for debugging
      Logger.log(`Error from GitHub API: ${responseBody}`);
      throw new Error(`Failed to fetch data. GitHub API responded with code: ${responseCode}. Check Logs for details.`);
    }

    const secretsAlerts = JSON.parse(responseBody);

    if (secretsAlerts.length === 0) {
      //ui.alert('No secret scanning alerts found for repo::'+repoName);
      //Logger.log('No secret scanning alerts found for repo::'+repoName);
      //return;
    }
  //}
  return secretsAlerts;

}

function importSecretScanningVulnerabilitiesToSheet() {
  const ui = SpreadsheetApp.getUi();
  
  try{
    const { githubEnterpriseUrl, githubOrg, githubToken, sheetId, dependabotSheetName, secretsScanningSheetName, codeScanningSheetName } = getScriptProperties();
    const repoAPIUrl = `https://api.github.com/graphql`;

    let allSecretsVulnerabilities = [];

    const progressHtml = `<p>Processing secrets alerts!</p>`;
    ui.showSidebar(HtmlService.createHtmlOutput(progressHtml).setTitle('Import Progress'));

    const vulnerabilities = getSecretsVulnerabilitiesForOrg(githubOrg, githubToken);
    vulnerabilities.forEach(vuln => {   //Severity set statically to High since no severity is assigned from GH
        allSecretsVulnerabilities.push([
            'Placeholder - ProjectName',
            vuln.repository.name,
            vuln.number,
            vuln.state,
            'High',
            vuln.secret,
            vuln.secret_type_display_name,
            new Date(vuln.created_at),
            (vuln.resolved_by==null)?"":vuln.resolved_by.login,
            vuln.resolution_comment,
            new Date(vuln.resolved_at),
            vuln.html_url,
            'Placeholder - Days Opened',
            'Placeholder - Remediation Deadline',
            'Github Secrets Scanning'
        ]);
    });

    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(secretsScanningSheetName);
    sheet.clear();
    const headers = [ 'Project Name', 'Repo Name', 'Alert Number', 'State', 'Severity', 'Secret', 'Secret Type', 'Created At', 'Resolved By', 'Resolution Comment', 'Resolved At', 'Link to Alert', 'Days Opened', 'Remediation Deadline', 'Source' ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(2,1, allSecretsVulnerabilities.length, headers.length).setValues(allSecretsVulnerabilities);
    const COL_SS_PROJECT_NAME = 1;
    const COL_SS_REPO_Name = 2;
    const COL_SS_ALERT_NUM = 3;
    const COL_SS_STATE = 4;
    const COL_SS_SEVERITY = 5; 
    const COL_SS_SECRET = 6;
    const COL_SS_SECRET_TYPE = 7;
    const COL_SS_CREATED_AT = 8;
    const COL_SS_RESOLVED_BY = 9;
    const COL_SS_RESOLUTION_COMMENT = 10;
    const COL_SS_RESOLVED_AT = 11;
    const COL_SS_LINK_TO_ALERT = 12;
    const COL_SS_DAYS_OPENED = 13;
    const COL_SS_REMEDIATION_DEADLINE = 14;
    const COL_SS_SOURCE = 15;

    //Set Project Repo Mapping
    sheet.getRange(2,COL_SS_PROJECT_NAME,allSecretsVulnerabilities.length,1).setFormulaR1C1("=If(isna(xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C2:R300C2,\'Project-Repo Mappings\'!R1C1:R300C1)),\"\",xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C2:R300C2,\'Project-Repo Mappings\'!R1C1:R300C1))");   //Set reference formulas for calculated data - Project name lookup

    //Set Days Opened calculation -
    sheet.getRange(2,COL_SS_DAYS_OPENED,allSecretsVulnerabilities.length,1).setFormulaR1C1('=If(Not(isBlank(R[0]C[-2])),datedif(R[0]C[-5],R[0]C[-2],"D"),datedif(R[0]C[-5],today(),"D"))');

    //Set Remediation Deadline Calculation - =F2+XLOOKUP(D2,RemediationPolicyTimelines!$A$1:$A$4,RemediationPolicyTimelines!$B$1:$B$4)
    sheet.getRange(2,COL_SS_REMEDIATION_DEADLINE,allSecretsVulnerabilities.length,1).setFormulaR1C1('=R[0]C[-6]+XLOOKUP(R[0]C[-9],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)');

    //DATA CLEANUP and Normalization
    startRow = 2;
    lastRow = allSecretsVulnerabilities.length
    var valueToDelete = new Date(null);

    //Clear out any default blank dates in 'Resolved At' Column
    columnNumber = COL_SS_RESOLVED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }

    //Data Normalization



    ui.showSidebar(HtmlService.createHtmlOutput('<p>Secrets Import complete!</p>').setTitle('Import Progress'));
    ui.alert('Success', 'Secret Scanning data has been imported successfully.', ui.ButtonSet.OK);



  } catch (e) {
    ui.alert('Error', e.message, ui.ButtonSet.OK);
    Logger.log(e.toString());
  }
}