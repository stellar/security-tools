/**
 * Fetches the script properties set by the user.
 * @returns {object} The script properties.
 */
function getDataSynchScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  const sheetId = properties.getProperty('SHEET_ID');
  const dependabotSheetName = properties.getProperty('GH_DEPENDABOT_SHEET_NAME');
  const secretsScanningSheetName = properties.getProperty('GH_SECRETSSCANNING_SHEET_NAME');
  const codeScanningSheetName = properties.getProperty('GH_CODESCANNING_SHEET_NAME');
  const jiraBugBountySheetName = properties.getProperty('JIRA_BUGBOUNTY_SHEET_NAME'); 
  const auditSheetName = properties.getProperty('AUDIT_SHEET_NAME');
  const allVulnsSheetName = properties.getProperty('ALL_VULNS_SHEET_NAME')
  if (!sheetId || !dependabotSheetName || !secretsScanningSheetName || !codeScanningSheetName || !jiraBugBountySheetName || !auditSheetName || !allVulnsSheetName) {
    throw new Error("One or more script properties are not set. Please configure them in Project Settings.");
  }

  return { sheetId, dependabotSheetName, secretsScanningSheetName, codeScanningSheetName, jiraBugBountySheetName, auditSheetName, allVulnsSheetName };
}


function dataSynch_AllVulnerabilities() {
  const ui = SpreadsheetApp.getUi();

  //General Approach - Import each data source sheet one at a time in order, inserting spaces in columns where there is no data
  //  - Dependabot
  //  - Secrets Scanning
  //  - Code scanning
  //  - Jira Bug Bounty
  //Pull values first for all
  //Backfill afterwards with R1C1 formulas for appropriate columns - Formulas for each column should be consistent across all data sources once merged

  try {
    const { sheetId, dependabotSheetName, secretsScanningSheetName, codeScanningSheetName, jiraBugBountySheetName, auditSheetName, allVulnsSheetName } = getDataSynchScriptProperties();
    
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const allVulnsSheet = spreadsheet.getSheetByName(allVulnsSheetName);
    const dependabotSheet = spreadsheet.getSheetByName(dependabotSheetName);
    const secretsScanningSheet = spreadsheet.getSheetByName(secretsScanningSheetName);
    const codeScanningSheet = spreadsheet.getSheetByName(codeScanningSheetName);
    const jiraBugBountySheet = spreadsheet.getSheetByName(jiraBugBountySheetName);
    const auditImportsSheet = spreadsheet.getSheetByName(auditSheetName);
    
    if (!allVulnsSheet) {
        throw new Error(`Sheet with name "${allVulnsSheetName}" not found.`);
    }

    // Clear existing data and set headers
    allVulnsSheet.clear();
    const headers = ['Team Name', 'Project Name', 'Repo Name', 'Package', 'Severity', 'Summary', 'Secret Type', 'Created At', 'Triaged At', 'Vulnerability Confirmation', 'Payout Amount', 'Auto Dismissed At', 'Dismissed At', 'Dismiss Comment', 'Dismisser Name', 'Dismiss Reason', 'Fixed At', 'Status', 'Status - Extended', 'Vulnerability ID', 'Vulnerability Link', 'Vulnerable Filename', 'Vulnerable Filepath', 'Vulnerable Requirements', 'PII Exposure', 'Financial Risk', 'Labels', 'Days Opened', 'Remediation Deadline', 'Source' ];
    allVulnsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    //Column identifier AV for All Vulnerabilities
    const COL_AV_TEAM_NAME = 1;
    const COL_AV_PROJECT_NAME = 2;
    const COL_AV_REPO_NAME = 3;
    const COL_AV_PACKAGE = 4;
    const COL_AV_SEVERITY = 5;
    const COL_AV_SUMMARY = 6;
    const COL_AV_SECRET_TYPE = 7;
    const COL_AV_CREATED_AT = 8;
    const COL_AV_TRIAGED_AT = 9;
    const COL_AV_VULNERABILITY_CONFIRMATION = 10;
    const COL_AV_PAYOUT_AMOUNT = 11;
    const COL_AV_AUTO_DISMISSED_AT = 12;
    const COL_AV_DISMISSED_AT = 13;
    const COL_AV_DISMISS_COMMENT = 14;
    const COL_AV_DISMISSER_NAME = 15;
    const COL_AV_DISMISS_REASON = 16;
    const COL_AV_FIXED_AT = 17;
    const COL_AV_STATUS = 18;
    const COL_AV_STATUS_EXTENDED = 19;
    const COL_AV_VULNERABILITY_ID = 20;
    const COL_AV_VULNERABILITY_LINK = 21;
    const COL_AV_VULNERABLE_FILENAME = 22;
    const COL_AV_VULNERABLE_FILEPATH = 23;
    const COL_AV_VULNERABLE_REQUIREMENTS = 24;
    const COL_AV_PII_EXPOSURE = 25;
    const COL_AV_FINANCIAL_RISK = 26;
    const COL_AV_LABELS = 27;
    const COL_AV_DAYS_OPENED = 28;
    const COL_AV_REMEDIATION_DEADLINE = 29;
    const COL_AV_SOURCE = 30;

    let allVulns = [];
    ui.showSidebar(HtmlService.createHtmlOutput('<p>Merging dependabot results into universal tab...</p>').setTitle('Import Progress'));
    //Load Dependabot Vulns
    const dependabotRange = dependabotSheet.getDataRange();
    var lastRow = dependabotRange.getLastRow();
    var dependabotVulns = dependabotRange.getValues();
    for(i=1;i<lastRow;i++) { //Starting at index 1 skips header row, which doesn't apply to the universal vulns sheet
      //Subtracting one for all column constants because arrays are 0 indexed, but the columns are 1 indexed
      allVulns.push( [
        "=If(isna(xlookup(R[0]C[2],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C1:R300C1)),\"\",xlookup(R[0]C[2],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C1:R300C1))",   //dependabotVulns[i][COL_DP_TEAM_NAME-1],
        "=If(isna(xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C2:R300C2)),\"\",xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C2:R300C2))",    //dependabotVulns[i][COL_DP_PROJECT_NAME-1],
        dependabotVulns[i][COL_DP_REPOSITORY-1],
        dependabotVulns[i][COL_DP_PACKAGE-1],
        dependabotVulns[i][COL_DP_SEVERITY-1],
        dependabotVulns[i][COL_DP_SUMMARY-1],
        '',
        (dependabotVulns[i][COL_DP_CREATED_AT-1]=='')?'':new Date(dependabotVulns[i][COL_DP_CREATED_AT-1]),
        '',
        '',
        '',
        (dependabotVulns[i][COL_DP_AUTO_DISMISSED_AT-1]=='')?'':new Date(dependabotVulns[i][COL_DP_AUTO_DISMISSED_AT-1]),
        (dependabotVulns[i][COL_DP_DISMISSED_AT-1]=='')?'':new Date(dependabotVulns[i][COL_DP_DISMISSED_AT-1]),
        dependabotVulns[i][COL_DP_DISMISS_COMMENT-1],
        dependabotVulns[i][COL_DP_DISMISSER_NAME-1],
        dependabotVulns[i][COL_DP_DISMISS_REASON-1],
        (dependabotVulns[i][COL_DP_FIXED_AT-1]=='')?'':new Date(dependabotVulns[i][COL_DP_FIXED_AT-1]),
        dependabotVulns[i][COL_DP_STATUS-1],
        '',
        dependabotVulns[i][COL_DP_GHSA_ID-1],
        dependabotVulns[i][COL_DP_REPO_LINK-1],
        dependabotVulns[i][COL_DP_VULNERABLE_FILENAME-1],
        dependabotVulns[i][COL_DP_VULNERABLE_FILEPATH-1],
        "'"+dependabotVulns[i][COL_DP_VULNERABLE_REQUIREMENTS-1],
        '',
        '',
        '',
        '=If(Not(isBlank(R[0]C[-15])),datedif(R[0]C[-20],R[0]C[-15],"D"),If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-20],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-16])),datedif(R[0]C[-20],R[0]C[-16],"D"),datedif(R[0]C[-20],today(),"D"))))',    //dependabotVulns[i][COL_DP_DAYS_OPENED-1],
        '=R[0]C[-21]+XLOOKUP(R[0]C[-24],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)',    //Remediation Deadline
        dependabotVulns[i][COL_DP_SOURCE-1]
      ]);
    } //End Dependabot Load


    ui.showSidebar(HtmlService.createHtmlOutput('<p>Merging secret scanning results into universal tab...</p>').setTitle('Import Progress'));
    //  - Secrets Scanning
    const secretsScanningRange = secretsScanningSheet.getDataRange();
    lastRow = secretsScanningRange.getLastRow();
    secretsScanningVulns = secretsScanningRange.getValues();
    for(i=1;i<lastRow;i++){
      allVulns.push( [    
        "=If(isna(xlookup(R[0]C[2],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C1:R300C1)),\"\",xlookup(R[0]C[2],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C1:R300C1))",   //secretsScanningVulns[i][COL_SS_TEAM_NAME-1],
        "=If(isna(xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C2:R300C2)),\"\",xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C2:R300C2))",    //secretsScanningVulns[i][COL_SS_PROJECT_NAME-1],
        secretsScanningVulns[i][COL_SS_REPO_Name-1],
        '',
        secretsScanningVulns[i][COL_SS_SEVERITY-1],
        secretsScanningVulns[i][COL_SS_SECRET-1],
        secretsScanningVulns[i][COL_SS_SECRET_TYPE-1],
        (secretsScanningVulns[i][COL_SS_CREATED_AT-1]=='')?'':new Date(secretsScanningVulns[i][COL_SS_CREATED_AT-1]),
        '',
        '',
        '',
        '',
        (secretsScanningVulns[i][COL_SS_RESOLVED_AT-1]=='')?'':new Date(secretsScanningVulns[i][COL_SS_RESOLVED_AT-1]),
        secretsScanningVulns[i][COL_SS_RESOLUTION_COMMENT-1],
        secretsScanningVulns[i][COL_SS_RESOLVED_BY-1],
        '',
        (secretsScanningVulns[i][COL_SS_FIXED_AT-1]=='')?'':new Date(secretsScanningVulns[i][COL_SS_FIXED_AT-1]),
        secretsScanningVulns[i][COL_SS_STATE-1],
        '',
        secretsScanningVulns[i][COL_SS_ALERT_NUM-1],
        secretsScanningVulns[i][COL_SS_LINK_TO_ALERT-1],
        '',
        '',
        '',
        '',
        '',
        '',
        '=If(Not(isBlank(R[0]C[-15])),datedif(R[0]C[-20],R[0]C[-15],"D"),If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-20],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-16])),datedif(R[0]C[-20],R[0]C[-16],"D"),datedif(R[0]C[-20],today(),"D"))))',    //secretsScanningVulns[i][COL_SS_DAYS_OPENED-1]
        '=R[0]C[-21]+XLOOKUP(R[0]C[-24],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)',    //secretsScanningVulns[i][COL_SS_REMEDIATION_DEADLINE-1],
        secretsScanningVulns[i][COL_SS_SOURCE-1]
      ]);
    }  //End Secrets Scanning Load
    //


    ui.showSidebar(HtmlService.createHtmlOutput('<p>Merging code scanning results into universal tab...</p>').setTitle('Import Progress'));
    //  - Code Scanning
    const codeScanningRange = codeScanningSheet.getDataRange();
    lastRow = codeScanningRange.getLastRow();
    codeScanningVulns = codeScanningRange.getValues();
    for(i=1;i<lastRow;i++){
      allVulns.push([
        "=If(isna(xlookup(R[0]C[2],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C1:R300C1)),\"\",xlookup(R[0]C[2],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C1:R300C1))",   //codeScanningVulns[i][COL_CS_TEAM_NAME-1],
        "=If(isna(xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C2:R300C2)),\"\",xlookup(R[0]C[1],\'Project-Repo Mappings\'!R1C3:R300C3,\'Project-Repo Mappings\'!R1C2:R300C2))",    //codeScanningVulns[i][COL_CS_PROJECT_NAME-1],
        codeScanningVulns[i][COL_CS_REPO_NAME-1],
        '',
        codeScanningVulns[i][COL_CS_SEVERITY-1],
        codeScanningVulns[i][COL_CS_SUMMARY-1],
        '',
        (codeScanningVulns[i][COL_CS_CREATED_AT-1]=='')?'':new Date(codeScanningVulns[i][COL_CS_CREATED_AT-1]),
        '',
        '',
        '',
        '',
        (codeScanningVulns[i][COL_CS_DISMISSED_AT-1]=='')?'':new Date(codeScanningVulns[i][COL_CS_DISMISSED_AT-1]),
        codeScanningVulns[i][COL_CS_DISMISS_COMMENT-1],
        codeScanningVulns[i][COL_CS_DISMISSER_NAME-1],
        codeScanningVulns[i][COL_CS_DISMISS_REASON-1],
        (codeScanningVulns[i][COL_CS_FIXED_AT-1]=='')?'':new Date(codeScanningVulns[i][COL_CS_FIXED_AT-1]),
        codeScanningVulns[i][COL_CS_STATUS-1],
        '',
        codeScanningVulns[i][COL_CS_ID_NUMBER-1],
        codeScanningVulns[i][COL_CS_REPO_LINK-1],
        '',
        '',
        '',
        '',
        '',
        '',
        '=If(Not(isBlank(R[0]C[-15])),datedif(R[0]C[-20],R[0]C[-15],"D"),If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-20],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-16])),datedif(R[0]C[-20],R[0]C[-16],"D"),datedif(R[0]C[-20],today(),"D"))))',    //codeScanningVulns[i][COL_CS_DAYS_OPENED-1],
        '=R[0]C[-21]+XLOOKUP(R[0]C[-24],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)',    //codeScanningVulns[i][COL_CS_REMEDIATION_DEADLINE-1],
        codeScanningVulns[i][COL_CS_SOURCE-1]
      ]);

    }  //End Code-Scanning Load

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Merging bug bounty results into universal tab...</p>').setTitle('Import Progress'));
    //  - Jira Bug Bounty
    const jiraBugbountyRange = jiraBugBountySheet.getDataRange();
    var lastRow = jiraBugbountyRange.getLastRow();
    var jiraBugBountyVulns = jiraBugbountyRange.getValues();
    for(var i=1;i<lastRow;i++){
      allVulns.push([
        jiraBugBountyVulns[i][COL_BB_TEAM_NAME-1],
        jiraBugBountyVulns[i][COL_BB_PROJECT_NAME-1],
        '',
        '',
        jiraBugBountyVulns[i][COL_BB_SEVERITY-1],
        jiraBugBountyVulns[i][COL_BB_SUMMARY-1],
        '',
        (jiraBugBountyVulns[i][COL_BB_CREATED_AT-1]=='')?'':new Date(jiraBugBountyVulns[i][COL_BB_CREATED_AT-1]),
        (jiraBugBountyVulns[i][COL_BB_TRIAGED_AT-1]=='')?'':new Date(jiraBugBountyVulns[i][COL_BB_TRIAGED_AT-1]),
        jiraBugBountyVulns[i][COL_BB_VULNERABILITY_CONFIRMATION-1],
        jiraBugBountyVulns[i][COL_BB_PAYOUT_AMOUNT-1],
        '',
        '',
        '',
        '',
        '',
        (jiraBugBountyVulns[i][COL_BB_FIXED_AT-1]=='')?'':new Date(jiraBugBountyVulns[i][COL_BB_FIXED_AT-1]),
        "=If(or(R[0]C[1]=\"Risk Accepted\",R[0]C[1]=\"False Positive\"),\"Dismissed\",If(Or(R[0]C[1]=\"In Progress\",R[0]C[1]=\"Under Review\"),\"Open\",If(R[0]C[1]=\"Remediated\",\"Fixed\",\"\")))",
        jiraBugBountyVulns[i][COL_BB_STATUS_EXTENDED-1],
        jiraBugBountyVulns[i][COL_BB_VULNERABILITY_ID-1],
        jiraBugBountyVulns[i][COL_BB_VULNERABILITY_LINK-1],
        '',
        '',
        '',
        jiraBugBountyVulns[i][COL_BB_PII_EXPOSURE-1],
        jiraBugBountyVulns[i][COL_BB_FINANCIAL_RISK-1],
        jiraBugBountyVulns[i][COL_BB_LABELS-1],
        '=If(Not(isBlank(R[0]C[-15])),datedif(R[0]C[-20],R[0]C[-15],"D"),If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-20],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-16])),datedif(R[0]C[-20],R[0]C[-16],"D"),datedif(R[0]C[-20],today(),"D"))))',    //jiraBugBountyVulns[i][COL_BB_DAYS_OPENED-1],
        '=R[0]C[-21]+XLOOKUP(R[0]C[-24],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)',    //jiraBugBountyVulns[i][COL_BB_REMEDIATION_DEADLINE-1],
        jiraBugBountyVulns[i][COL_BB_SOURCE-1]
      ]);
    }  //End Bug Bounty Load

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Merging audit results into universal tab...</p>').setTitle('Import Progress'));
    //  - Audit Imports
    const auditImportsRange = auditImportsSheet.getDataRange();
    lastRow = auditImportsRange.getLastRow();
    var auditImportsVulns = auditImportsRange.getValues();
    for(var i=1;i<lastRow;i++){
      allVulns.push([
        auditImportsVulns[i][COL_AV_TEAM_NAME-1],    //Using AV columns since date for Audit table is the same as the all vulns table to provide maximum flexibility
        auditImportsVulns[i][COL_AV_PROJECT_NAME-1],
        auditImportsVulns[i][COL_AV_REPO_NAME-1],
        auditImportsVulns[i][COL_AV_PACKAGE-1],
        auditImportsVulns[i][COL_AV_SEVERITY-1],
        auditImportsVulns[i][COL_AV_SUMMARY-1],
        auditImportsVulns[i][COL_AV_SECRET_TYPE-1],
        (auditImportsVulns[i][COL_AV_CREATED_AT-1]=='')?'':auditImportsVulns[i][COL_AV_CREATED_AT-1],
        (auditImportsVulns[i][COL_AV_TRIAGED_AT-1]=='')?'':auditImportsVulns[i][COL_AV_TRIAGED_AT-1],
        auditImportsVulns[i][COL_AV_VULNERABILITY_CONFIRMATION-1],
        auditImportsVulns[i][COL_AV_PAYOUT_AMOUNT-1],
        (auditImportsVulns[i][COL_AV_AUTO_DISMISSED_AT-1]=='')?'':auditImportsVulns[i][COL_AV_AUTO_DISMISSED_AT-1],
        (auditImportsVulns[i][COL_AV_DISMISSED_AT-1]=='')?'':auditImportsVulns[i][COL_AV_DISMISSED_AT-1],
        auditImportsVulns[i][COL_AV_DISMISS_COMMENT-1],
        auditImportsVulns[i][COL_AV_DISMISSER_NAME-1],
        auditImportsVulns[i][COL_AV_DISMISS_REASON-1],
        (auditImportsVulns[i][COL_AV_FIXED_AT-1]=='')?'':auditImportsVulns[i][COL_AV_FIXED_AT-1],
        auditImportsVulns[i][COL_AV_STATUS-1],
        auditImportsVulns[i][COL_AV_STATUS_EXTENDED-1],
        auditImportsVulns[i][COL_AV_VULNERABILITY_ID-1],
        auditImportsVulns[i][COL_AV_VULNERABILITY_LINK-1],
        auditImportsVulns[i][COL_AV_VULNERABLE_FILENAME-1],
        auditImportsVulns[i][COL_AV_VULNERABLE_FILEPATH-1],
        auditImportsVulns[i][COL_AV_VULNERABLE_REQUIREMENTS-1],
        auditImportsVulns[i][COL_AV_PII_EXPOSURE-1],
        auditImportsVulns[i][COL_AV_FINANCIAL_RISK-1],
        auditImportsVulns[i][COL_AV_LABELS-1],
        '=If(Not(isBlank(R[0]C[-15])),datedif(R[0]C[-20],R[0]C[-15],"D"),If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-20],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-16])),datedif(R[0]C[-20],R[0]C[-16],"D"),datedif(R[0]C[-20],today(),"D"))))',     //auditImportsVulns[i][COL_AV_DAYS_OPENED-1],
        '=R[0]C[-21]+XLOOKUP(R[0]C[-24],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)',    //auditImportsVulns[i][COL_AV_REMEDIATION_DEADLINE-1],
        auditImportsVulns[i][COL_AV_SOURCE-1]
      
      ]);
    }  //End Audit Import Load


    if (allVulns.length > 0) {
      allVulnsSheet.getRange(2, 1, allVulns.length, headers.length).setValues(allVulns);
    }

    const startRow = 2;
    lastRow = allVulns.length;
    columnNumber = COL_AV_SEVERITY;
    var dataNormalizationRange = allVulnsSheet.getRange(startRow, columnNumber, lastRow, 1);
    var dataNormalizationValues = dataNormalizationRange.getValues();
    //Iterate through the Values and update them to the global standard
    for(var i = 0; i<dataNormalizationValues.length;i++) {
      switch(dataNormalizationValues[i][0].toLowerCase()) {
        case 'critical':
          allVulnsSheet.getRange(i + startRow, columnNumber).setValue(SEV_CRITICAL);
          break;
        case 'high':
          allVulnsSheet.getRange(i + startRow, columnNumber).setValue(SEV_HIGH);
          break;
        case 'moderate':
          allVulnsSheet.getRange(i + startRow, columnNumber).setValue(SEV_MODERATE);
          break;
        case 'low':
          allVulnsSheet.getRange(i + startRow, columnNumber).setValue(SEV_LOW);
          break;
      }
    }

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Data Synch complete!</p>').setTitle('Import Progress'));
    ui.alert('Success', 'Vulnerabilities have been synched to the universal tab successfully.', ui.ButtonSet.OK);

  } catch (e) {
    ui.alert('Error', e.message, ui.ButtonSet.OK);
    Logger.log(e.toString());
  }
}
