/**
 * Fetches the script properties set by the user.
 * @returns {object} The script properties.
 */
function getJiraScriptProperties() {
  const ui = SpreadsheetApp.getUi();
  const properties = PropertiesService.getScriptProperties();
  const userProperties = PropertiesService.getUserProperties();
  const sheetID = properties.getProperty('SHEET_ID')
  const JiraURL = properties.getProperty('JIRA_URL');
  var JiraEmail = userProperties.getProperty('JIRA_EMAIL');
  var JiraAPIToken = userProperties.getProperty('JIRA_API_TOKEN');

  if (JiraEmail === null) {
    const ui = SpreadsheetApp.getUi();
    const result = ui.prompt(
        'Setup Required',
        `The Jira Email for the API is not set. Please enter your Jira API email to continue.`,
        ui.ButtonSet.OK_CANCEL);

    // Check if the user clicked 'OK' and provided a value.
    if (result.getSelectedButton() == ui.Button.OK && result.getResponseText() !== '') {
      // Get the user's input.
      JiraEmail = result.getResponseText();
      
      // Store the new value.
      userProperties.setProperty('JIRA_EMAIL', JiraEmail);
      Logger.log(`Property JIRA_EMAIL has been set and stored.`);
    }
  }

  if (JiraAPIToken === null) {
    const ui = SpreadsheetApp.getUi();
    const result = ui.prompt(
        'Setup Required',
        `The Jira API token is not set. Please enter your Jira API token to continue.`,
        ui.ButtonSet.OK_CANCEL);

    // Check if the user clicked 'OK' and provided a value.
    if (result.getSelectedButton() == ui.Button.OK && result.getResponseText() !== '') {
      // Get the user's input.
      JiraAPIToken = result.getResponseText();
      
      // Store the new value.
      userProperties.setProperty('JIRA_API_TOKEN', JiraAPIToken);
      Logger.log(`Property JIRA_API_TOKEN has been set and stored.`);
    }
  }

  const JiraBugBountySheetName = properties.getProperty('JIRA_BUGBOUNTY_SHEET_NAME'); 
  if (!sheetID || !JiraURL || !JiraEmail || !JiraAPIToken || !JiraBugBountySheetName) {
    throw new Error("One or more script properties are not set. Please configure them in Project Settings.")
  }
  
  return { sheetID, JiraURL, JiraEmail, JiraAPIToken, JiraBugBountySheetName};
}


function getJiraVulnerabilityImportsforOrg(JiraURL, JiraEmail, JiraAPIToken) {
 /***
  * URL for issue linkhttps://stellarorg.atlassian.net/browse/SE-1324 
  */ 

  let JiraBase = JiraURL+"/rest/api/latest/search/jql?jql=";
  let JiraJQL= "filter=10718";
  let JiraFields = "*navigable";

  let vulnerabilities = [];
  let hasNextPage = true;
  let bbNextPageToken = '';
  let cursor = null;
  const ui = SpreadsheetApp.getUi();

  while (hasNextPage) {
    //const variables = { org: orgName, repo: repoName, cursor: cursor };
    //const payload = JSON.stringify({ query, variables });
    const headers = {
      "Authorization": `Basic ${Utilities.base64Encode(`${JiraEmail}:${JiraAPIToken}`)}`,
      "Accept":"application/json"
    }

    const options = {
      'method': 'get',
      'contentType': 'application/json',
      'headers': headers,      
      'muteHttpExceptions': true
    };
    JiraQueryURL = `${JiraBase}${encodeURIComponent(JiraJQL)}&fields=${JiraFields}&nextPageToken=${bbNextPageToken}`;
    const response = UrlFetchApp.fetch(JiraQueryURL, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    //Logger.log(responseBody);
    //ui.alert(responseBody);
    
    
    if (responseCode !== 200) {
      // Log the error response from GitHub for debugging
      Logger.log(`Error from Jira API: ${responseBody}`);
      throw new Error(`Failed to fetch data. Jira API responded with code: ${responseCode}. Check Logs for details.`);
    }
    
    const bugBountyList = JSON.parse(responseBody);
    const bugBountyIssues = bugBountyList.issues;
    const vulnLength = vulnerabilities.push(bugBountyIssues);
    //ui.alert(`${bugBountyIssues.length} issues added and a new total list of ${vulnLength}.`);
    
    if (bugBountyList.isLast || bugBountyIssues.length === 0) {
      //ui.alert(`${bugBountyList.nextPageToken}`)
      Logger.log("No more issues found.");
      hasNextPage = false;
      continue;
    } else {
      bbNextPageToken=bugBountyList.nextPageToken;
    }
    



    
  }
  return vulnerabilities;

}

const COL_BB_TEAM_NAME = 1;
const COL_BB_PROJECT_NAME = 2;
const COL_BB_SEVERITY = 3;
const COL_BB_SUMMARY = 4;
const COL_BB_CREATED_AT = 5;
const COL_BB_TRIAGED_AT = 6;
const COL_BB_VULNERABILITY_CONFIRMATION = 7;
const COL_BB_PAYOUT_AMOUNT = 8;
const COL_BB_FIXED_AT = 9;
const COL_BB_STATUS = 10;
const COL_BB_STATUS_EXTENDED = 11;
const COL_BB_VULNERABILITY_ID = 12;
const COL_BB_VULNERABILITY_LINK = 13;
const COL_BB_PII_EXPOSURE = 14;
const COL_BB_FINANCIAL_RISK = 15;
const COL_BB_LABELS = 16;
const COL_BB_DAYS_OPENED = 17;
const COL_BB_REMEDIATION_DEADLINE = 18;
const COL_BB_SOURCE = 19;

function importBugBountyVulnerabilitiesToSheet(){
  const ui = SpreadsheetApp.getUi();
  let allJiraBounties = [];
  try {
    const {sheetID, JiraURL, JiraEmail, JiraAPIToken, JiraBugBountySheetName} = getJiraScriptProperties();

    
    jiraBounties = getJiraVulnerabilityImportsforOrg(JiraURL, JiraEmail, JiraAPIToken);
    //ui.alert(`Found ${jiraBounties.length} bounties in Jira.`)
    for(i=0;i<jiraBounties.length;i++){
      jiraBounties[i].forEach(issue => {
      //jiraBounties.forEach(issue => {
      
        const fields=issue.fields;
        //ui.alert(issue.fields);
        //ui.alert(fields.customfield_10265);
        allJiraBounties.push([
          (fields.customfield_10265==null) ? '':fields.customfield_10265.value,
          (fields.customfield_10266==null) ? '':fields.customfield_10266.value,
          (fields.customfield_10233==null) ? '':fields.customfield_10233.value,
          fields.summary,
          new Date(fields.customfield_10463),
          new Date(fields.customfield_10465),
          (fields.customfield_10232==null) ? '':fields.customfield_10232[0].value,
          fields.customfield_10234,
          new Date(fields.customfield_10464),
          'Placeholder Status',
          (fields.customfield_10339==null)?'':fields.customfield_10339.value,
          issue.key,
          `${JiraURL}/browse/${issue.key}`,
          (fields.customfield_10364==null)?'':fields.customfield_10364[0].value,
          (fields.customfield_10365==null)?'':fields.customfield_10365[0].value,
          fields.labels.toString(),
          'Placeholder - Days Opened',
          'Placeholder - Remediation Deadline',
          'Jira Bug Bounty'
        ]);
      });
    }

    const spreadsheet = SpreadsheetApp.openById(sheetID);
    const sheet = spreadsheet.getSheetByName(JiraBugBountySheetName);
    sheet.clear();
    const headers = [ 'Team Name', 'Project Name', 'Severity', 'Summary', 'CreatedAt', 'TriagedAt', 'Vulnerability Confirmation', 'Payout Amount', 'FixedAt', 'Status', 'Status - Extended', 'Vulnerability ID', 'Vulnerability Link', 'PII Exposure', 'Financial Risk', 'Labels', 'Days Opened', 'Remediation Deadline', 'Source'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(2,1, allJiraBounties.length, headers.length).setValues(allJiraBounties);
    

    //Updating Status
    ui.showSidebar(HtmlService.createHtmlOutput('<p>Updating status...').setTitle('Import Progress'));
    //Set Status - Read value of status extended and set appropriate value.
    sheet.getRange(2,COL_BB_STATUS,allJiraBounties.length,1).setFormulaR1C1("=If(or(R[0]C[1]=\"Risk Accepted\",R[0]C[1]=\"False Positive\"),\"Dismissed\",If(Or(R[0]C[1]=\"In Progress\",R[0]C[1]=\"Under Review\"),\"Open\",If(R[0]C[1]=\"Remediated\",\"Fixed\",\"\")))");   //Set reference formulas for calculated data - Team name lookup

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Updating days opened calculation...').setTitle('Import Progress'));
    //Set Days Opened calculation - =If(Not(isBlank(FIXED_AT)),datedif(CREATED_AT,FIXED_AT,"D"),datedif(CREATED_AT,today(),"D"))
    sheet.getRange(2,COL_BB_DAYS_OPENED,allJiraBounties.length,1).setFormulaR1C1('=If(Not(isBlank(R[0]C[-8])),datedif(R[0]C[-12],R[0]C[-8],"D"),datedif(R[0]C[-12],today(),"D"))');

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Updating remediation deadline calculation...').setTitle('Import Progress'));
    //Set Remediation Deadline Calculation - =CREATED_AT+XLOOKUP(SEVERITY,RemediationPolicyTimelines!$A$1:$A$4,RemediationPolicyTimelines!$B$1:$B$4)
    sheet.getRange(2,COL_BB_REMEDIATION_DEADLINE,allJiraBounties.length,1).setFormulaR1C1('=R[0]C[-13]+XLOOKUP(R[0]C[-15],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)');


    //DATA CLEANUP and Normalization
    startRow = 2;
    lastRow = allJiraBounties.length
    var valueToDelete = new Date(null);

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Cleaning up Triaged At empty dates...</p>').setTitle('Import Progress'));
    //Clear out any default blank dates in 'Triaged At' Column
    columnNumber = COL_BB_TRIAGED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Cleaning up Fixed At empty dates...</p>').setTitle('Import Progress'));
    //Clear out any default blank dates in 'Fixed At' Column
    columnNumber = COL_BB_FIXED_AT;
    var dateCleanupRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var values = dateCleanupRange.getValues();

    // Iterate through the values and clear cells matching the target value
    for (var i = 0; i < values.length; i++) {
      if (values[i][0].getTime() == valueToDelete.getTime()) {
        sheet.getRange(i + startRow, columnNumber).clearContent();
      }
    }

    //Data Normalization
    const BB_SEV_CRITICAL = 'Critical';
    const BB_SEV_HIGH = 'High';
    const BB_SEV_MODERATE = 'Medium';
    const BB_SEV_LOW = 'Low';
    const BB_SEV_INFORMATIONAL = 'Informational'

    ui.showSidebar(HtmlService.createHtmlOutput('<p>Normalizing severity ratings...</p>').setTitle('Import Progress'));

    columnNumber = COL_BB_SEVERITY;
    var dataNormalizationRange = sheet.getRange(startRow, columnNumber, lastRow, 1);
    var dataNormalizationValues = dataNormalizationRange.getValues();
    //Iterate through the Values and update them to the global standard
    for(var i = 0; i<values.length;i++) {
      switch(dataNormalizationValues[i][0]) {
        case BB_SEV_CRITICAL:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_CRITICAL);
          break;
        case BB_SEV_HIGH:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_HIGH);
          break;
        case BB_SEV_MODERATE:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_MODERATE);
          break;
        case BB_SEV_LOW:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_LOW);
          break;
        case BB_SEV_INFORMATIONAL:
          sheet.getRange(i + startRow, columnNumber).setValue(SEV_LOW);
          break;
      }
    }



    ui.showSidebar(HtmlService.createHtmlOutput('<p>Jira Bounties Import complete!</p>').setTitle('Import Progress'));
    ui.alert('Success', 'Jira bounty data has been imported successfully.', ui.ButtonSet.OK);

  } catch (e) {
    ui.alert('Error', e.message, ui.ButtonSet.OK);
    Logger.log(e.toString());
  }
  
}
