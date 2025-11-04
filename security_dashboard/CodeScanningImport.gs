/**
 * Fetches vulnerability alerts for a specific repository.
 * @param {string} secretsAPIUrl - The GitHub GraphQL API endpoint.
 * @param {string} orgName - The name of the organization.
 * @param {string} repoName - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Array} A list of vulnerability alert objects.
 */
function getCodeScanningVulnerabilitiesForOrg(orgName, token) {
  let codeScanningAPIUrl = "https://api.github.com/orgs/"+orgName+"/code-scanning/alerts";
  let vulnerabilities = [];
  let hasNextPage = true;
  let cursor = null;
  const ui = SpreadsheetApp.getUi();

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

  const response = UrlFetchApp.fetch(codeScanningAPIUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  Logger.log(responseBody);
    
  if (responseCode !== 200) {
    if (responseCode === 404) {
      throw new Error(`Organization '${ORG_NAME}' not found or Code Scanning is not enabled.`);
    }
    if (responseCode === 401) {
      throw new Error("Authentication failed. Check if your GITHUB_TOKEN is correct and has the right scopes.");
    }
    // Log the full error for debugging
    Logger.log(responseText);
    throw new Error(`GitHub API request failed with code ${responseCode}.`);
  }

  const codeScanningAlerts = JSON.parse(responseBody);
  return codeScanningAlerts;

}

function importCodeScanningVulnerabilitiesToSheet() {
  const ui = SpreadsheetApp.getUi();
  try{
    const { githubEnterpriseUrl, githubOrg, githubToken, sheetId, dependabotSheetName, secretsScanningSheetName, codeScanningSheetName } = getScriptProperties();

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Starting vulnerability import...</p><p>Fetching code scanning results...</p>').setTitle('Import Progress'));

    let allCodeScanningVulnerabilities = [];
    const vulnerabilities = getCodeScanningVulnerabilitiesForOrg(githubOrg, githubToken);
    vulnerabilities.forEach(vuln => {
      allCodeScanningVulnerabilities.push([
        "PlaceholderProjectName",
        vuln.repository.name,
        vuln.rule.security_severity_level,
        vuln.rule.description,
        new Date(vuln.created_at),
        new Date(vuln.dismissed_at),
        vuln.dismissed_comment,
        (vuln.dismissed_by==null)?"":vuln.dismissed_by.login,
        vuln.dismissed_reason,
        new Date(vuln.fixed_at),
        vuln.state,
        vuln.number,
        vuln.html_url,
        "Placeholder - Days Opened",
        "Placeholder - Remediation Deadline",
        "Github Code Scanning"
        ]);
    });
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(codeScanningSheetName);
    sheet.clear();
    const headers = ['Project Name', 'Repo Name', 'Severity', 'Summary', 'Created At', 'Dismissed At', 'Dismiss Comment', 'Dismisser Name', 'Dismiss Reason', 'Fixed At', 'Status', 'ID Number', 'Repo Link', 'Days Opened', 'Remediation Deadline', 'Source' ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(2,1, allCodeScanningVulnerabilities.length, headers.length).setValues(allCodeScanningVulnerabilities);
    
    const COL_CS_PROJECT_NAME = 1;
    const COL_CS_REPO_NAME = 2;
    const COL_CS_SEVERITY = 3;
    const COL_CS_SUMMARY = 4;
    const COL_CREATED_AT = 5;
    const COL_CS_DISMISSED_AT = 6;
    const COL_CS_DISMISS_COMMENT = 7;
    const COL_CS_DISMISSER_NAME = 8;
    const COL_CS_DISMISS_REASON = 9;
    const COL_CS_FIXED_AT = 10;
    const COL_CS_STATUS = 11;
    const COL_CS_ID_NUMBER = 12;
    const COL_CS_REPO_LINK = 13;
    const COL_CS_DAYS_OPENED = 14;
    const COL_CS_REMEDIATION_DEADLINE = 15;
    const COL_CS_SOURCE = 16;
    
    //Set Project Repo Mapping
    sheet.getRange(2,COL_CS_PROJECT_NAME,allCodeScanningVulnerabilities.length,1).setFormulaR1C1("=If(isna(xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C2:R300C2,\'Project-Repo Mappings\'!R1C1:R300C1)),\"\",xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C2:R300C2,\'Project-Repo Mappings\'!R1C1:R300C1))");   //Set reference formulas for calculated data - Project name lookup

    //Set Days Opened calculation - =If(Not(isBlank(DISMISSED_AT)),datedif(CREATED_AT,DISMISSED_AT,"D"),If(Not(isBlank(FIXED_AT)),datedif(CREATED_AT,FIXED_AT,"D"), datedif(CREATED_AT,today(),"D")))
      sheet.getRange(2,COL_CS_DAYS_OPENED,allCodeScanningVulnerabilities.length,1).setFormulaR1C1('=If(Not(isBlank(R[0]C[-8])),datedif(R[0]C[-9],R[0]C[-8],"D"),If(Not(isBlank(R[0]C[-4])),datedif(R[0]C[-9],R[0]C[-4],"D"),datedif(R[0]C[-9],today(),"D")))');

    //Set Remediation Deadline Calculation - =CREATED_AT+XLOOKUP(SEVERITY,RemediationPolicyTimelines!$A$1:$A$4,RemediationPolicyTimelines!$B$1:$B$4)
    sheet.getRange(2,COL_CS_REMEDIATION_DEADLINE,allCodeScanningVulnerabilities.length,1).setFormulaR1C1('=R[0]C[-10]+XLOOKUP(R[0]C[-12],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)');

    //DATA CLEANUP and Normalization
    startRow = 2;
    lastRow = allCodeScanningVulnerabilities.length
    var valueToDelete = new Date(null);

    //Clear out any default blank dates in 'Fixed At' Column
    columnNumber = COL_CS_FIXED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }

    //Clear out any default blank dates in 'Dismissed At' Column
    columnNumber = COL_CS_DISMISSED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }
  
    //Data Normalization
    const CS_SEV_CRITICAL = 'critical';
    const CS_SEV_HIGH = 'high';
    const CS_SEV_MODERATE = 'medium';
    const CS_SEV_LOW = 'low';

    columnNumber = COL_CS_SEVERITY;
    var dataNormalizationRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var dataNormalizationValues = dataNormalizationRange.getValues();
    //Iterate through the Values and update them to the global standard
    for(var i = 0; i<values.length;i++) {
      switch(dataNormalizationValues[i][0]) {
        case CS_SEV_CRITICAL:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_CRITICAL);
          break;
        case CS_SEV_HIGH:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_HIGH);
          break;
        case CS_SEV_MODERATE:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_MODERATE);
          break;
        case CS_SEV_LOW:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_LOW);
          break;
      }
    }



    ui.showSidebar(HtmlService.createHtmlOutput('<p>Code Scanning Import complete!</p>').setTitle('Import Progress'));
    ui.alert('Success', 'Code Scanning data has been imported successfully.', ui.ButtonSet.OK);

  } catch (e) {
    ui.alert('Error', e.message, ui.ButtonSet.OK);
    Logger.log(e.toString());
  }
}
