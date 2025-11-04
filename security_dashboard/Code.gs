{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red46\green49\blue51;\red21\green98\blue39;\red246\green247\blue249;
\red77\green80\blue85;\red20\green67\blue174;\red186\green6\blue115;\red162\green0\blue16;\red24\green25\blue27;
\red191\green28\blue37;\red18\green115\blue126;}
{\*\expandedcolortbl;;\cssrgb\c23529\c25098\c26275;\cssrgb\c7451\c45098\c20000;\cssrgb\c97255\c97647\c98039;
\cssrgb\c37255\c38824\c40784;\cssrgb\c9412\c35294\c73725;\cssrgb\c78824\c15294\c52549;\cssrgb\c70196\c7843\c7059;\cssrgb\c12549\c12941\c14118;
\cssrgb\c80392\c19216\c19216;\cssrgb\c3529\c52157\c56863;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs26 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf3 \cb4 \strokec3 /**\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @OnlyCurrentDoc\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  *\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * The above comment directs App Script to limit the scope of authorization\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * to only the current spreadsheet.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  */\cf2 \cb1 \strokec2 \
\
\pard\pardeftab720\partightenfactor0
\cf5 \cb4 \strokec5 // --- CONFIGURATION ---\cf2 \cb1 \strokec2 \
\cf5 \cb4 \strokec5 // Go to Script Editor -> Project Settings -> Script Properties and add the following:\cf2 \cb1 \strokec2 \
\cf5 \cb4 \strokec5 // GITHUB_ENTERPRISE_URL: Your GitHub Enterprise URL (e.g., https://github.yourcompany.com)\cf2 \cb1 \strokec2 \
\cf5 \cb4 \strokec5 // GITHUB_ORG: The name of your GitHub organization.\cf2 \cb1 \strokec2 \
\cf5 \cb4 \strokec5 // GITHUB_TOKEN: Your GitHub Personal Access Token with 'repo' and 'read:org' scopes.\cf2 \cb1 \strokec2 \
\cf5 \cb4 \strokec5 // SHEET_ID: The ID of your Google Sheet.\cf2 \cb1 \strokec2 \
\cf5 \cb4 \strokec5 // SHEET_NAME: The name of the sheet/tab where data will be imported.\cf2 \cb1 \strokec2 \
\
\cf5 \cb4 \strokec5 //Data Normalization Constants\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 SEV_CRITICAL\cf2 \strokec2  = \cf8 \strokec8 'Critical'\cf2 \strokec2 ;\cb1 \
\cf6 \cb4 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 SEV_HIGH\cf2 \strokec2  = \cf8 \strokec8 'High'\cf2 \strokec2 ;\cb1 \
\cf6 \cb4 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 SEV_MODERATE\cf2 \strokec2  = \cf8 \strokec8 'Moderate'\cf2 \strokec2 ;\cb1 \
\cf6 \cb4 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 SEV_LOW\cf2 \strokec2  = \cf8 \strokec8 'Low'\cf2 \strokec2 ;\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf3 \cb4 \strokec3 /**\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * Creates a custom menu in the spreadsheet to run the importer.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  */\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 onOpen\cf2 \strokec2 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf7 \strokec7 SpreadsheetApp\cf2 \strokec2 .\cf9 \strokec9 getUi\cf2 \strokec2 ()\cb1 \
\cb4     .\cf9 \strokec9 createMenu\cf2 \strokec2 (\cf8 \strokec8 'GitHub Vulnerabilities'\cf2 \strokec2 )\cb1 \
\cb4     .\cf9 \strokec9 addItem\cf2 \strokec2 (\cf8 \strokec8 'Import All GH Vulnerability Data'\cf2 \strokec2 , \cf8 \strokec8 'importVulnerabilitiesToSheet'\cf2 \strokec2 )\cb1 \
\cb4     .\cf9 \strokec9 addItem\cf2 \strokec2 (\cf8 \strokec8 'Import GH Dependabot Vulnerabilities'\cf2 \strokec2 , \cf8 \strokec8 'importDependabotVulnerabilitiesToSheet'\cf2 \strokec2 )\cb1 \
\cb4     .\cf9 \strokec9 addItem\cf2 \strokec2 (\cf8 \strokec8 'Import GH Secrets Scanning Vulnerabilities'\cf2 \strokec2 , \cf8 \strokec8 'importSecretScanningVulnerabilitiesToSheet'\cf2 \strokec2 )\cb1 \
\cb4     .\cf9 \strokec9 addItem\cf2 \strokec2 (\cf8 \strokec8 'Import GH CodeScanning Vulnerabilities'\cf2 \strokec2 , \cf8 \strokec8 'importCodeScanningVulnerabilitiesToSheet'\cf2 \strokec2 )\cb1 \
\cb4     .\cf9 \strokec9 addToUi\cf2 \strokec2 ();\cb1 \
\cb4 \}\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf3 \cb4 \strokec3 /**\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * Fetches the script properties set by the user.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @returns \{object\} The script properties.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  */\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 getScriptProperties\cf2 \strokec2 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 properties\cf2 \strokec2  = \cf7 \strokec7 PropertiesService\cf2 \strokec2 .\cf9 \strokec9 getScriptProperties\cf2 \strokec2 ();\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 githubEnterpriseUrl\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'GITHUB_ENTERPRISE_URL'\cf2 \strokec2 );\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 githubOrg\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'GITHUB_ORG'\cf2 \strokec2 );\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 githubToken\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'GITHUB_TOKEN'\cf2 \strokec2 );\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 sheetId\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'SHEET_ID'\cf2 \strokec2 );\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 dependabotSheetName\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'GH_DEPENDABOT_SHEET_NAME'\cf2 \strokec2 );\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 secretsScanningSheetName\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'GH_SECRETSSCANNING_SHEET_NAME'\cf2 \strokec2 );\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 codeScanningSheetName\cf2 \strokec2  = \cf9 \strokec9 properties\cf2 \strokec2 .\cf9 \strokec9 getProperty\cf2 \strokec2 (\cf8 \strokec8 'GH_CODESCANNING_SHEET_NAME'\cf2 \strokec2 );\cb1 \
\
\cb4   \cf6 \strokec6 if\cf2 \strokec2  (!\cf9 \strokec9 githubEnterpriseUrl\cf2 \strokec2  || !\cf9 \strokec9 githubOrg\cf2 \strokec2  || !\cf9 \strokec9 githubToken\cf2 \strokec2  || !\cf9 \strokec9 sheetId\cf2 \strokec2  || !\cf9 \strokec9 dependabotSheetName\cf2 \strokec2  || !\cf9 \strokec9 secretsScanningSheetName\cf2 \strokec2  || !\cf9 \strokec9 codeScanningSheetName\cf2 \strokec2 ) \{\cb1 \
\cb4     \cf6 \strokec6 throw\cf2 \strokec2  \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Error\cf2 \strokec2 (\cf8 \strokec8 "One or more script properties are not set. Please configure them in Project Settings."\cf2 \strokec2 );\cb1 \
\cb4   \}\cb1 \
\
\cb4   \cf6 \strokec6 return\cf2 \strokec2  \{ \cf9 \strokec9 githubEnterpriseUrl\cf2 \strokec2 , \cf9 \strokec9 githubOrg\cf2 \strokec2 , \cf9 \strokec9 githubToken\cf2 \strokec2 , \cf9 \strokec9 sheetId\cf2 \strokec2 , \cf9 \strokec9 dependabotSheetName\cf2 \strokec2 , \cf9 \strokec9 secretsScanningSheetName\cf2 \strokec2 , \cf9 \strokec9 codeScanningSheetName\cf2 \strokec2  \};\cb1 \
\cb4 \}\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf3 \cb4 \strokec3 /**\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * Fetches all repositories for the configured GitHub organization.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} apiUrl - The GitHub GraphQL API endpoint.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} orgName - The name of the organization.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} token - The GitHub Personal Access Token.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @returns \{Array\} A list of repository names.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  */\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf5 \cb4 \strokec5 //\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 getOrgRepositories\cf2 \strokec2 (\cf9 \strokec9 apiUrl\cf2 \strokec2 , \cf9 \strokec9 orgName\cf2 \strokec2 , \cf9 \strokec9 token\cf2 \strokec2 ) \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 query\cf2 \strokec2  = \cf8 \strokec8 `\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf8 \cb4 \strokec8     query(\cf10 \strokec10 $\cf8 \strokec8 org: String!, \cf10 \strokec10 $\cf8 \strokec8 cursor: String) \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8       organization(login: \cf10 \strokec10 $\cf8 \strokec8 org) \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8         repositories(first: 100, isArchived: false, after: \cf10 \strokec10 $\cf8 \strokec8 cursor) \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           pageInfo \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             endCursor\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             hasNextPage\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           nodes \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             name\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             isArchived\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8         \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8       \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8     \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8   `\cf2 \strokec2 ;\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 repositories\cf2 \strokec2  = [];\cb1 \
\cb4   \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 hasNextPage\cf2 \strokec2  = \cf6 \strokec6 true\cf2 \strokec2 ;\cb1 \
\cb4   \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 cursor\cf2 \strokec2  = \cf6 \strokec6 null\cf2 \strokec2 ;\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 ui\cf2 \strokec2  = \cf7 \strokec7 SpreadsheetApp\cf2 \strokec2 .\cf9 \strokec9 getUi\cf2 \strokec2 ();\cb1 \
\
\cb4   \cf6 \strokec6 while\cf2 \strokec2  (\cf9 \strokec9 hasNextPage\cf2 \strokec2 ) \{\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 variables\cf2 \strokec2  = \{ \cf9 \strokec9 org\cf2 \strokec2 : \cf9 \strokec9 orgName\cf2 \strokec2 , \cf9 \strokec9 cursor\cf2 \strokec2 : \cf9 \strokec9 cursor\cf2 \strokec2  \};\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 payload\cf2 \strokec2  = \cf7 \strokec7 JSON\cf2 \strokec2 .\cf9 \strokec9 stringify\cf2 \strokec2 (\{ \cf9 \strokec9 query\cf2 \strokec2 , \cf9 \strokec9 variables\cf2 \strokec2  \});\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 options\cf2 \strokec2  = \{\cb1 \
\cb4       \cf8 \strokec8 'method'\cf2 \strokec2 : \cf8 \strokec8 'POST'\cf2 \strokec2 ,\cb1 \
\cb4       \cf8 \strokec8 'contentType'\cf2 \strokec2 : \cf8 \strokec8 'application/json'\cf2 \strokec2 ,\cb1 \
\cb4       \cf8 \strokec8 'headers'\cf2 \strokec2 : \{\cb1 \
\cb4         \cf8 \strokec8 'Authorization'\cf2 \strokec2 : \cf8 \strokec8 `Bearer \cf2 \strokec2 $\{\cf9 \strokec9 token\cf2 \strokec2 \}\cf8 \strokec8 `\cf2 \cb1 \strokec2 \
\cb4       \},\cb1 \
\cb4       \cf8 \strokec8 'payload'\cf2 \strokec2 : \cf9 \strokec9 payload\cf2 \strokec2 ,\cb1 \
\cb4       \cf8 \strokec8 'muteHttpExceptions'\cf2 \strokec2 : \cf6 \strokec6 true\cf2 \cb1 \strokec2 \
\cb4     \};\cb1 \
\cb4     \cf5 \strokec5 //ui.alert("pre-fetch");\cf2 \cb1 \strokec2 \
\cb4     \cf5 \strokec5 //apiUrl="https://api.github.com/graphql";\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 response\cf2 \strokec2  = \cf7 \strokec7 UrlFetchApp\cf2 \strokec2 .\cf9 \strokec9 fetch\cf2 \strokec2 (\cf9 \strokec9 apiUrl\cf2 \strokec2 , \cf9 \strokec9 options\cf2 \strokec2 );\cb1 \
\cb4     \cf5 \strokec5 //ui.alert(response.getContentText());\cf2 \cb1 \strokec2 \
\cb4     \cf5 \strokec5 //Bug catching---\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 responseCode\cf2 \strokec2  = \cf9 \strokec9 response\cf2 \strokec2 .\cf9 \strokec9 getResponseCode\cf2 \strokec2 ();\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 responseBody\cf2 \strokec2  = \cf9 \strokec9 response\cf2 \strokec2 .\cf9 \strokec9 getContentText\cf2 \strokec2 ();\cb1 \
\
\cb4     \cf5 \strokec5 // Check for non-200 HTTP status codes\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 responseCode\cf2 \strokec2  !== \cf11 \strokec11 200\cf2 \strokec2 ) \{\cb1 \
\cb4       \cf7 \strokec7 Logger\cf2 \strokec2 .\cf9 \strokec9 log\cf2 \strokec2 (\cf8 \strokec8 `GitHub API request failed in getOrgRepositories. Status: \cf2 \strokec2 $\{\cf9 \strokec9 responseCode\cf2 \strokec2 \}\cf8 \strokec8 . Body: \cf2 \strokec2 $\{\cf9 \strokec9 responseBody\cf2 \strokec2 \}\cf8 \strokec8 `\cf2 \strokec2 );\cb1 \
\cb4       \cf5 \strokec5 // Try to parse the error for a better message\cf2 \cb1 \strokec2 \
\cb4       \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 detailedError\cf2 \strokec2  = \cf8 \strokec8 `Status code \cf2 \strokec2 $\{\cf9 \strokec9 responseCode\cf2 \strokec2 \}\cf8 \strokec8 .`\cf2 \strokec2 ;\cb1 \
\cb4       \cf6 \strokec6 try\cf2 \strokec2  \{\cb1 \
\cb4         \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 errorResult\cf2 \strokec2  = \cf7 \strokec7 JSON\cf2 \strokec2 .\cf9 \strokec9 parse\cf2 \strokec2 (\cf9 \strokec9 responseBody\cf2 \strokec2 );\cb1 \
\cb4         \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 errorResult\cf2 \strokec2 .\cf9 \strokec9 message\cf2 \strokec2 ) \{\cb1 \
\cb4           \cf9 \strokec9 detailedError\cf2 \strokec2  += \cf8 \strokec8 ` Message: \cf2 \strokec2 $\{\cf9 \strokec9 errorResult\cf2 \strokec2 .\cf9 \strokec9 message\cf2 \strokec2 \}\cf8 \strokec8 `\cf2 \strokec2 ;\cb1 \
\cb4         \}\cb1 \
\cb4       \} \cf6 \strokec6 catch\cf2 \strokec2  (\cf9 \strokec9 e\cf2 \strokec2 ) \{\cb1 \
\cb4         \cf5 \strokec5 // Body is not JSON, just show the raw body\cf2 \cb1 \strokec2 \
\cb4         \cf9 \strokec9 detailedError\cf2 \strokec2  += \cf8 \strokec8 ` Response: \cf2 \strokec2 $\{\cf9 \strokec9 responseBody\cf2 \strokec2 \}\cf8 \strokec8 `\cf2 \strokec2 ;\cb1 \
\cb4       \}\cb1 \
\cb4       \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 errorMessage\cf2 \strokec2  = \cf8 \strokec8 `GitHub API request failed. \cf2 \strokec2 $\{\cf9 \strokec9 detailedError\cf2 \strokec2 \}\cf8 \strokec8  Check Logs and Script Properties.`\cf2 \strokec2 ;\cb1 \
\cb4       \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 alert\cf2 \strokec2 (\cf8 \strokec8 'GitHub API Error'\cf2 \strokec2 , \cf9 \strokec9 errorMessage\cf2 \strokec2 , \cf9 \strokec9 ui\cf2 \strokec2 .\cf7 \strokec7 ButtonSet\cf2 \strokec2 .\cf7 \strokec7 OK\cf2 \strokec2 );\cb1 \
\cb4       \cf6 \strokec6 throw\cf2 \strokec2  \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Error\cf2 \strokec2 (\cf9 \strokec9 errorMessage\cf2 \strokec2 );\cb1 \
\cb4     \}\cb1 \
\cb4     \cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 result\cf2 \strokec2  = \cf7 \strokec7 JSON\cf2 \strokec2 .\cf9 \strokec9 parse\cf2 \strokec2 (\cf9 \strokec9 response\cf2 \strokec2 .\cf9 \strokec9 getContentText\cf2 \strokec2 ());\cb1 \
\
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 errors\cf2 \strokec2 ) \{\cb1 \
\cb4       \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 alert\cf2 \strokec2 (\cf8 \strokec8 'GitHub API Error'\cf2 \strokec2 , \cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 errors\cf2 \strokec2 [\cf11 \strokec11 0\cf2 \strokec2 ].\cf9 \strokec9 message\cf2 \strokec2 , \cf9 \strokec9 ui\cf2 \strokec2 .\cf7 \strokec7 ButtonSet\cf2 \strokec2 .\cf7 \strokec7 OK\cf2 \strokec2 );\cb1 \
\cb4       \cf6 \strokec6 throw\cf2 \strokec2  \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Error\cf2 \strokec2 (\cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 errors\cf2 \strokec2 [\cf11 \strokec11 0\cf2 \strokec2 ].\cf9 \strokec9 message\cf2 \strokec2 );\cb1 \
\cb4     \}\cb1 \
\cb4     \cb1 \
\cb4     \cf5 \strokec5 //End of bug catching---\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 data\cf2 \strokec2  = \cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 organization\cf2 \strokec2 .\cf9 \strokec9 repositories\cf2 \strokec2 ;\cb1 \
\cb4     \cf9 \strokec9 repositories\cf2 \strokec2  = \cf9 \strokec9 repositories\cf2 \strokec2 .\cf9 \strokec9 concat\cf2 \strokec2 (\cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 nodes\cf2 \strokec2 .\cf9 \strokec9 map\cf2 \strokec2 (\cf9 \strokec9 repo\cf2 \strokec2  => \cf9 \strokec9 repo\cf2 \strokec2 .\cf9 \strokec9 name\cf2 \strokec2 ));\cb1 \
\cb4     \cf9 \strokec9 hasNextPage\cf2 \strokec2  = \cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 pageInfo\cf2 \strokec2 .\cf9 \strokec9 hasNextPage\cf2 \strokec2 ;\cb1 \
\cb4     \cf9 \strokec9 cursor\cf2 \strokec2  = \cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 pageInfo\cf2 \strokec2 .\cf9 \strokec9 endCursor\cf2 \strokec2 ;\cb1 \
\cb4   \}\cb1 \
\cb4   \cb1 \
\cb4   \cf6 \strokec6 return\cf2 \strokec2  \cf9 \strokec9 repositories\cf2 \strokec2 ;\cb1 \
\cb4 \}\cb1 \
\
\
\pard\pardeftab720\partightenfactor0
\cf3 \cb4 \strokec3 /**\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * Fetches vulnerability alerts for a specific repository.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} apiUrl - The GitHub GraphQL API endpoint.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} orgName - The name of the organization.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} repoName - The name of the repository.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @param \{string\} token - The GitHub Personal Access Token.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * @returns \{Array\} A list of vulnerability alert objects.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  */\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 getVulnerabilitiesForRepo\cf2 \strokec2 (\cf9 \strokec9 apiUrl\cf2 \strokec2 , \cf9 \strokec9 orgName\cf2 \strokec2 , \cf9 \strokec9 repoName\cf2 \strokec2 , \cf9 \strokec9 token\cf2 \strokec2 ) \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 query\cf2 \strokec2  = \cf8 \strokec8 `\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf8 \cb4 \strokec8     query(\cf10 \strokec10 $\cf8 \strokec8 org: String!, \cf10 \strokec10 $\cf8 \strokec8 repo: String!, \cf10 \strokec10 $\cf8 \strokec8 cursor: String) \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8       repository(owner: \cf10 \strokec10 $\cf8 \strokec8 org, name: \cf10 \strokec10 $\cf8 \strokec8 repo) \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8         vulnerabilityAlerts(first: 100, after: \cf10 \strokec10 $\cf8 \strokec8 cursor) \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           pageInfo \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             endCursor\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             hasNextPage\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           nodes \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             createdAt\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             autoDismissedAt\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             dismissedAt\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             dismissComment\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             dismisser \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8               name\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             dismissReason\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             fixedAt\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             state\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             number\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             securityVulnerability \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8               package \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8                 name\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8               \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8               severity\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8               advisory \{\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8                 summary\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8                 ghsaId\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8               \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             vulnerableManifestFilename\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             vulnerableManifestPath\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8             vulnerableRequirements\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8           \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8         \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8       \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8     \}\cf2 \cb1 \strokec2 \
\cf8 \cb4 \strokec8   `\cf2 \strokec2 ;\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 vulnerabilities\cf2 \strokec2  = [];\cb1 \
\cb4   \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 hasNextPage\cf2 \strokec2  = \cf6 \strokec6 true\cf2 \strokec2 ;\cb1 \
\cb4   \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 cursor\cf2 \strokec2  = \cf6 \strokec6 null\cf2 \strokec2 ;\cb1 \
\cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 ui\cf2 \strokec2  = \cf7 \strokec7 SpreadsheetApp\cf2 \strokec2 .\cf9 \strokec9 getUi\cf2 \strokec2 ();\cb1 \
\
\cb4   \cf6 \strokec6 while\cf2 \strokec2  (\cf9 \strokec9 hasNextPage\cf2 \strokec2 ) \{\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 variables\cf2 \strokec2  = \{ \cf9 \strokec9 org\cf2 \strokec2 : \cf9 \strokec9 orgName\cf2 \strokec2 , \cf9 \strokec9 repo\cf2 \strokec2 : \cf9 \strokec9 repoName\cf2 \strokec2 , \cf9 \strokec9 cursor\cf2 \strokec2 : \cf9 \strokec9 cursor\cf2 \strokec2  \};\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 payload\cf2 \strokec2  = \cf7 \strokec7 JSON\cf2 \strokec2 .\cf9 \strokec9 stringify\cf2 \strokec2 (\{ \cf9 \strokec9 query\cf2 \strokec2 , \cf9 \strokec9 variables\cf2 \strokec2  \});\cb1 \
\
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 options\cf2 \strokec2  = \{\cb1 \
\cb4       \cf8 \strokec8 'method'\cf2 \strokec2 : \cf8 \strokec8 'post'\cf2 \strokec2 ,\cb1 \
\cb4       \cf8 \strokec8 'contentType'\cf2 \strokec2 : \cf8 \strokec8 'application/json'\cf2 \strokec2 ,\cb1 \
\cb4       \cf8 \strokec8 'headers'\cf2 \strokec2 : \{\cb1 \
\cb4         \cf8 \strokec8 'Authorization'\cf2 \strokec2 : \cf8 \strokec8 `Bearer \cf2 \strokec2 $\{\cf9 \strokec9 token\cf2 \strokec2 \}\cf8 \strokec8 `\cf2 \cb1 \strokec2 \
\cb4       \},\cb1 \
\cb4       \cf8 \strokec8 'payload'\cf2 \strokec2 : \cf9 \strokec9 payload\cf2 \strokec2 ,\cb1 \
\cb4       \cf8 \strokec8 'muteHttpExceptions'\cf2 \strokec2 : \cf6 \strokec6 true\cf2 \cb1 \strokec2 \
\cb4     \};\cb1 \
\
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 response\cf2 \strokec2  = \cf7 \strokec7 UrlFetchApp\cf2 \strokec2 .\cf9 \strokec9 fetch\cf2 \strokec2 (\cf9 \strokec9 apiUrl\cf2 \strokec2 , \cf9 \strokec9 options\cf2 \strokec2 );\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 result\cf2 \strokec2  = \cf7 \strokec7 JSON\cf2 \strokec2 .\cf9 \strokec9 parse\cf2 \strokec2 (\cf9 \strokec9 response\cf2 \strokec2 .\cf9 \strokec9 getContentText\cf2 \strokec2 ());\cb1 \
\cb4     \cb1 \
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 errors\cf2 \strokec2 ) \{\cb1 \
\cb4        \cf5 \strokec5 // It's possible the repo has no vulnerability alerts enabled, so we log instead of stopping.\cf2 \cb1 \strokec2 \
\cb4       \cf9 \strokec9 console\cf2 \strokec2 .\cf9 \strokec9 log\cf2 \strokec2 (\cf8 \strokec8 `Could not fetch vulnerabilities for \cf2 \strokec2 $\{\cf9 \strokec9 repoName\cf2 \strokec2 \}\cf8 \strokec8 : \cf2 \strokec2 $\{\cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 errors\cf2 \strokec2 [\cf11 \strokec11 0\cf2 \strokec2 ].\cf9 \strokec9 message\cf2 \strokec2 \}\cf8 \strokec8 `\cf2 \strokec2 );\cb1 \
\cb4       \cf6 \strokec6 return\cf2 \strokec2  [];\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (!\cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 repository\cf2 \strokec2  || !\cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 repository\cf2 \strokec2 .\cf9 \strokec9 vulnerabilityAlerts\cf2 \strokec2 ) \{\cb1 \
\cb4       \cf9 \strokec9 console\cf2 \strokec2 .\cf9 \strokec9 log\cf2 \strokec2 (\cf8 \strokec8 `No vulnerability alerts found or feature not enabled for \cf2 \strokec2 $\{\cf9 \strokec9 repoName\cf2 \strokec2 \}\cf8 \strokec8 .`\cf2 \strokec2 );\cb1 \
\cb4       \cf6 \strokec6 return\cf2 \strokec2  [];\cb1 \
\cb4     \}\cb1 \
\cb4     \cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 data\cf2 \strokec2  = \cf9 \strokec9 result\cf2 \strokec2 .\cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 repository\cf2 \strokec2 .\cf9 \strokec9 vulnerabilityAlerts\cf2 \strokec2 ;\cb1 \
\cb4     \cf9 \strokec9 vulnerabilities\cf2 \strokec2  = \cf9 \strokec9 vulnerabilities\cf2 \strokec2 .\cf9 \strokec9 concat\cf2 \strokec2 (\cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 nodes\cf2 \strokec2 );\cb1 \
\cb4     \cf9 \strokec9 hasNextPage\cf2 \strokec2  = \cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 pageInfo\cf2 \strokec2 .\cf9 \strokec9 hasNextPage\cf2 \strokec2 ;\cb1 \
\cb4     \cf9 \strokec9 cursor\cf2 \strokec2  = \cf9 \strokec9 data\cf2 \strokec2 .\cf9 \strokec9 pageInfo\cf2 \strokec2 .\cf9 \strokec9 endCursor\cf2 \strokec2 ;\cb1 \
\cb4   \}\cb1 \
\
\cb4   \cf6 \strokec6 return\cf2 \strokec2  \cf9 \strokec9 vulnerabilities\cf2 \strokec2 ;\cb1 \
\cb4 \}\cb1 \
\
\
\pard\pardeftab720\partightenfactor0
\cf3 \cb4 \strokec3 /**\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  * Main function to import vulnerabilities into the Google Sheet.\cf2 \cb1 \strokec2 \
\cf3 \cb4 \strokec3  */\cf2 \cb1 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 importVulnerabilitiesToSheet\cf2 \strokec2 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf9 \strokec9 importDependabotVulnerabilitiesToSheet\cf2 \strokec2 ();\cb1 \
\cb4   \cf9 \strokec9 importSecretScanningVulnerabilitiesToSheet\cf2 \strokec2 ();\cb1 \
\
\cb4 \}\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 importDependabotVulnerabilitiesToSheet\cf2 \strokec2 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 ui\cf2 \strokec2  = \cf7 \strokec7 SpreadsheetApp\cf2 \strokec2 .\cf9 \strokec9 getUi\cf2 \strokec2 ();\cb1 \
\cb4   \cf6 \strokec6 try\cf2 \strokec2  \{\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \{ \cf9 \strokec9 githubEnterpriseUrl\cf2 \strokec2 , \cf9 \strokec9 githubOrg\cf2 \strokec2 , \cf9 \strokec9 githubToken\cf2 \strokec2 , \cf9 \strokec9 sheetId\cf2 \strokec2 , \cf9 \strokec9 dependabotSheetName\cf2 \strokec2 , \cf9 \strokec9 secretsScanningSheetName\cf2 \strokec2 , \cf9 \strokec9 codeScanningSheetName\cf2 \strokec2  \} = \cf9 \strokec9 getScriptProperties\cf2 \strokec2 ();\cb1 \
\cb4     \cf5 \strokec5 //const apiUrl = `$\{githubEnterpriseUrl\}/api/graphql`;\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 apiUrl\cf2 \strokec2  = \cf8 \strokec8 `https://api.github.com/graphql`\cf2 \strokec2 ;\cb1 \
\
\cb4     \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 showSidebar\cf2 \strokec2 (\cf7 \strokec7 HtmlService\cf2 \strokec2 .\cf9 \strokec9 createHtmlOutput\cf2 \strokec2 (\cf8 \strokec8 '<p>Starting vulnerability import...</p><p>Fetching repositories...</p>'\cf2 \strokec2 ).\cf9 \strokec9 setTitle\cf2 \strokec2 (\cf8 \strokec8 'Import Progress'\cf2 \strokec2 ));\cb1 \
\
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 repositories\cf2 \strokec2  = \cf9 \strokec9 getOrgRepositories\cf2 \strokec2 (\cf9 \strokec9 apiUrl\cf2 \strokec2 , \cf9 \strokec9 githubOrg\cf2 \strokec2 , \cf9 \strokec9 githubToken\cf2 \strokec2 );\cb1 \
\cb4     \cf5 \strokec5 //ui.showSidebar(HtmlService.createHtmlOutput('here with' + repositories.length + ' repos right after finding them!'));\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 repositories\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2  === \cf11 \strokec11 0\cf2 \strokec2 ) \{\cb1 \
\cb4       \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 alert\cf2 \strokec2 (\cf8 \strokec8 'No repositories found in the organization.'\cf2 \strokec2 );\cb1 \
\cb4       \cf6 \strokec6 return\cf2 \strokec2 ;\cb1 \
\cb4     \}\cb1 \
\cb4     \cb1 \
\cb4     \cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 allVulnerabilities\cf2 \strokec2  = [];\cb1 \
\cb4     \cf5 \strokec5 //ui.alert('here with' + repositories.length + ' repos!');\cf2 \cb1 \strokec2 \
\cb4     \cf5 \strokec5 //ui.showSidebar(HtmlService.createHtmlOutput('here with' + repositories.length + ' repos!'));\cf2 \cb1 \strokec2 \
\cb4     \cf5 \strokec5 //var progressHtml = '';\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 for\cf2 \strokec2  (\cf6 \strokec6 let\cf2 \strokec2  \cf9 \strokec9 i\cf2 \strokec2  = \cf11 \strokec11 0\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2  < \cf9 \strokec9 repositories\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2 ++) \{\cb1 \
\cb4     \cf5 \strokec5 //for (let i = 0; i < 15; i++) \{\cf2 \cb1 \strokec2 \
\cb4         \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 repoName\cf2 \strokec2  = \cf9 \strokec9 repositories\cf2 \strokec2 [\cf9 \strokec9 i\cf2 \strokec2 ];\cb1 \
\cb4         \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 progressHtml\cf2 \strokec2  = \cf8 \strokec8 `<p>Processing repo \cf2 \strokec2 $\{\cf9 \strokec9 i\cf2 \strokec2  + \cf11 \strokec11 1\cf2 \strokec2 \}\cf8 \strokec8  of \cf2 \strokec2 $\{\cf9 \strokec9 repositories\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 \}\cf8 \strokec8 : \cf2 \strokec2 $\{\cf9 \strokec9 repoName\cf2 \strokec2 \}\cf8 \strokec8 </p>`\cf2 \strokec2 ;\cb1 \
\cb4         \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 showSidebar\cf2 \strokec2 (\cf7 \strokec7 HtmlService\cf2 \strokec2 .\cf9 \strokec9 createHtmlOutput\cf2 \strokec2 (\cf9 \strokec9 progressHtml\cf2 \strokec2 ).\cf9 \strokec9 setTitle\cf2 \strokec2 (\cf8 \strokec8 'Import Progress'\cf2 \strokec2 ));\cb1 \
\
\cb4         \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 vulnerabilities\cf2 \strokec2  = \cf9 \strokec9 getVulnerabilitiesForRepo\cf2 \strokec2 (\cf9 \strokec9 apiUrl\cf2 \strokec2 , \cf9 \strokec9 githubOrg\cf2 \strokec2 , \cf9 \strokec9 repoName\cf2 \strokec2 , \cf9 \strokec9 githubToken\cf2 \strokec2 );\cb1 \
\cb4         \cf9 \strokec9 vulnerabilities\cf2 \strokec2 .\cf9 \strokec9 forEach\cf2 \strokec2 (\cf9 \strokec9 vuln\cf2 \strokec2  => \{\cb1 \
\cb4             \cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 push\cf2 \strokec2 ([\cb1 \
\cb4                 \cf8 \strokec8 "PlaceholderProjectName"\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 repoName\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 securityVulnerability\cf2 \strokec2 .\cf9 \strokec9 package\cf2 \strokec2 .\cf9 \strokec9 name\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 securityVulnerability\cf2 \strokec2 .\cf9 \strokec9 severity\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 securityVulnerability\cf2 \strokec2 .\cf9 \strokec9 advisory\cf2 \strokec2 .\cf9 \strokec9 summary\cf2 \strokec2 ,\cb1 \
\cb4                 \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Date\cf2 \strokec2 (\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 createdAt\cf2 \strokec2 ),\cb1 \
\cb4                 \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Date\cf2 \strokec2 (\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 autoDismissedAt\cf2 \strokec2 ),\cb1 \
\cb4                 \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Date\cf2 \strokec2 (\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 dismissedAt\cf2 \strokec2 ),\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 dismissComment\cf2 \strokec2 ,\cb1 \
\cb4                 (\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 dismisser\cf2 \strokec2 ==\cf6 \strokec6 null\cf2 \strokec2 )?\cf8 \strokec8 ""\cf2 \strokec2 :\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 dismisser\cf2 \strokec2 .\cf9 \strokec9 name\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 dismissReason\cf2 \strokec2 ,\cb1 \
\cb4                 \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Date\cf2 \strokec2  (\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 fixedAt\cf2 \strokec2 ),\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 state\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 securityVulnerability\cf2 \strokec2 .\cf9 \strokec9 advisory\cf2 \strokec2 .\cf9 \strokec9 ghsaId\cf2 \strokec2 ,\cb1 \
\cb4                 \cf8 \strokec8 "https://github.com/stellar/"\cf2 \strokec2 +\cf9 \strokec9 repoName\cf2 \strokec2 +\cf8 \strokec8 "/security/dependabot/"\cf2 \strokec2 +\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 number\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 vulnerableManifestFilename\cf2 \strokec2 ,\cb1 \
\cb4                 \cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 vulnerableManifestPath\cf2 \strokec2 ,\cb1 \
\cb4                 \cf8 \strokec8 "'"\cf2 \strokec2 +\cf9 \strokec9 vuln\cf2 \strokec2 .\cf9 \strokec9 vulnerableRequirements\cf2 \strokec2 ,\cb1 \
\cb4                 \cf8 \strokec8 "Placeholder - Days Open"\cf2 \strokec2 ,\cb1 \
\cb4                 \cf8 \strokec8 "Placeholder - Remediation Deadline"\cf2 \strokec2 ,\cb1 \
\cb4                 \cf8 \strokec8 "GitHub Vulnerabilities (Dependabot)"\cf2 \cb1 \strokec2 \
\cb4             ]);\cb1 \
\cb4         \});\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 spreadsheet\cf2 \strokec2  = \cf7 \strokec7 SpreadsheetApp\cf2 \strokec2 .\cf9 \strokec9 openById\cf2 \strokec2 (\cf9 \strokec9 sheetId\cf2 \strokec2 );\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 sheet\cf2 \strokec2  = \cf9 \strokec9 spreadsheet\cf2 \strokec2 .\cf9 \strokec9 getSheetByName\cf2 \strokec2 (\cf9 \strokec9 dependabotSheetName\cf2 \strokec2 );\cb1 \
\cb4     \cb1 \
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (!\cf9 \strokec9 sheet\cf2 \strokec2 ) \{\cb1 \
\cb4         \cf6 \strokec6 throw\cf2 \strokec2  \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Error\cf2 \strokec2 (\cf8 \strokec8 `Sheet with name "\cf2 \strokec2 $\{\cf9 \strokec9 dependabotSheetName\cf2 \strokec2 \}\cf8 \strokec8 " not found.`\cf2 \strokec2 );\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cf5 \strokec5 // Clear existing data and set headers\cf2 \cb1 \strokec2 \
\cb4     \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 clear\cf2 \strokec2 ();\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf9 \strokec9 headers\cf2 \strokec2  = [\cf8 \strokec8 'Project Name'\cf2 \strokec2 ,\cf8 \strokec8 'Repository'\cf2 \strokec2 , \cf8 \strokec8 'Package'\cf2 \strokec2 , \cf8 \strokec8 'Severity'\cf2 \strokec2 , \cf8 \strokec8 'Summary'\cf2 \strokec2 , \cf8 \strokec8 'Created At'\cf2 \strokec2 , \cf8 \strokec8 'Auto Dismissed At'\cf2 \strokec2 , \cf8 \strokec8 'Dismissed At'\cf2 \strokec2 , \cf8 \strokec8 'Dismiss Comment'\cf2 \strokec2 , \cf8 \strokec8 'Dismisser Name'\cf2 \strokec2 , \cf8 \strokec8 'Dismiss Reason'\cf2 \strokec2 , \cf8 \strokec8 'FixedAt'\cf2 \strokec2 , \cf8 \strokec8 'Status'\cf2 \strokec2 , \cf8 \strokec8 'GHSA ID'\cf2 \strokec2 , \cf8 \strokec8 'Repo Link'\cf2 \strokec2 , \cf8 \strokec8 'Vulnerable Filename'\cf2 \strokec2 , \cf8 \strokec8 'Vulnerable Filepath'\cf2 \strokec2 , \cf8 \strokec8 'Vulnerable Requirements'\cf2 \strokec2 , \cf8 \strokec8 'Days Opened'\cf2 \strokec2 , \cf8 \strokec8 'Remediation Deadline'\cf2 \strokec2 , \cf8 \strokec8 'Source'\cf2 \strokec2 ];\cb1 \
\cb4     \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf11 \strokec11 1\cf2 \strokec2 , \cf11 \strokec11 1\cf2 \strokec2 , \cf11 \strokec11 1\cf2 \strokec2 , \cf9 \strokec9 headers\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ).\cf9 \strokec9 setValues\cf2 \strokec2 ([\cf9 \strokec9 headers\cf2 \strokec2 ]);\cb1 \
\
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_PROJECT_NAME\cf2 \strokec2  = \cf11 \strokec11 1\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_REPOSITORY\cf2 \strokec2  = \cf11 \strokec11 2\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_PACKAGE\cf2 \strokec2  = \cf11 \strokec11 3\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_SEVERITY\cf2 \strokec2  = \cf11 \strokec11 4\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_SUMMARY\cf2 \strokec2  = \cf11 \strokec11 5\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_CREATED_AT\cf2 \strokec2  = \cf11 \strokec11 6\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_AUTO_DISMISSED_AT\cf2 \strokec2  = \cf11 \strokec11 7\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_DISMISSED_AT\cf2 \strokec2  = \cf11 \strokec11 8\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_DISMISS_COMMENT\cf2 \strokec2  = \cf11 \strokec11 9\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_DISMISSER_NAME\cf2 \strokec2  = \cf11 \strokec11 10\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_DISMISS_REASON\cf2 \strokec2  = \cf11 \strokec11 11\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_FIXED_AT\cf2 \strokec2  = \cf11 \strokec11 12\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_STATUS\cf2 \strokec2  = \cf11 \strokec11 13\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_GHSA_ID\cf2 \strokec2  = \cf11 \strokec11 14\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_REPO_LINK\cf2 \strokec2  = \cf11 \strokec11 15\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_VULNERABLE_FILENAME\cf2 \strokec2  = \cf11 \strokec11 16\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_VULNERABLE_FILEPATH\cf2 \strokec2  = \cf11 \strokec11 17\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_VULNERABLE_REQUIREMENTS\cf2 \strokec2  = \cf11 \strokec11 18\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_DAYS_OPENED\cf2 \strokec2  = \cf11 \strokec11 19\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_REMEDIATION_DEADLINE\cf2 \strokec2  = \cf11 \strokec11 20\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 const\cf2 \strokec2  \cf7 \strokec7 COL_DP_SOURCE\cf2 \strokec2  = \cf11 \strokec11 21\cf2 \strokec2 ;\cb1 \
\
\
\
\cb4     \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2  > \cf11 \strokec11 0\cf2 \strokec2 ) \{\cb1 \
\cb4       \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf11 \strokec11 2\cf2 \strokec2 , \cf11 \strokec11 1\cf2 \strokec2 , \cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 , \cf9 \strokec9 headers\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ).\cf9 \strokec9 setValues\cf2 \strokec2 (\cf9 \strokec9 allVulnerabilities\cf2 \strokec2 );\cb1 \
\
\cb4       \cf5 \strokec5 //Set Project Repo Mapping\cf2 \cb1 \strokec2 \
\cb4       \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf11 \strokec11 2\cf2 \strokec2 ,\cf7 \strokec7 COL_DP_PROJECT_NAME\cf2 \strokec2 ,\cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ,\cf11 \strokec11 1\cf2 \strokec2 ).\cf9 \strokec9 setFormulaR1C1\cf2 \strokec2 (\cf8 \strokec8 "=If(isna(xlookup(R[0]C[1],\\'Project-Repo Mappings\\'!R1C2:R300C2,\\'Project-Repo Mappings\\'!R1C1:R300C1)),\\"\\",xlookup(R[0]C[1],\\'Project-Repo Mappings\\'!R1C2:R300C2,\\'Project-Repo Mappings\\'!R1C1:R300C1))"\cf2 \strokec2 );   \cf5 \strokec5 //Set reference formulas for calculated data - Project name lookup\cf2 \cb1 \strokec2 \
\
\cb4       \cf5 \strokec5 //Set Days Opened calculation - =If(Not(isBlank(H2)),datedif(F2,H2,"D"),If(Not(isBlank(L2)),datedif(F2,L2,"D"),If(Not(isBlank(G2)),datedif(F2,G2,"D"), datedif(F2,today(),"D"))))\cf2 \cb1 \strokec2 \
\cb4       \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf11 \strokec11 2\cf2 \strokec2 ,\cf7 \strokec7 COL_DP_DAYS_OPENED\cf2 \strokec2 ,\cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ,\cf11 \strokec11 1\cf2 \strokec2 ).\cf9 \strokec9 setFormulaR1C1\cf2 \strokec2 (\cf8 \strokec8 '=If(Not(isBlank(R[0]C[-11])),datedif(R[0]C[-13],R[0]C[-11],"D"),If(Not(isBlank(R[0]C[-7])),datedif(R[0]C[-13],R[0]C[-7],"D"),If(Not(isBlank(R[0]C[-12])),datedif(R[0]C[-13],R[0]C[-12],"D"),datedif(R[0]C[-13],today(),"D"))))'\cf2 \strokec2 );\cb1 \
\
\cb4       \cf5 \strokec5 //Set Remediation Deadline Calculation - =F2+XLOOKUP(D2,RemediationPolicyTimelines!$A$1:$A$4,RemediationPolicyTimelines!$B$1:$B$4)\cf2 \cb1 \strokec2 \
\cb4       \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf11 \strokec11 2\cf2 \strokec2 ,\cf7 \strokec7 COL_DP_REMEDIATION_DEADLINE\cf2 \strokec2 ,\cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ,\cf11 \strokec11 1\cf2 \strokec2 ).\cf9 \strokec9 setFormulaR1C1\cf2 \strokec2 (\cf8 \strokec8 '=R[0]C[-14]+XLOOKUP(R[0]C[-16],RemediationPolicyTimelines!R1C1:R4C1,RemediationPolicyTimelines!R1C2:R4C2)'\cf2 \strokec2 );\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cf5 \strokec5 //DATA CLEANUP\cf2 \cb1 \strokec2 \
\cb4     \cf9 \strokec9 startRow\cf2 \strokec2  = \cf11 \strokec11 2\cf2 \strokec2 ;\cb1 \
\cb4     \cf9 \strokec9 lastRow\cf2 \strokec2  = \cf9 \strokec9 allVulnerabilities\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \cb1 \strokec2 \
\cb4     \cf5 \strokec5 //var valueToDelete = new Date('12/31/1969 19:00:00');\cf2 \cb1 \strokec2 \
\cb4     \cf5 \strokec5 //var valueToDelete = new Date('');\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 valueToDelete\cf2 \strokec2  = \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Date\cf2 \strokec2 (\cf6 \strokec6 null\cf2 \strokec2 );\cb1 \
\
\cb4     \cf5 \strokec5 //Clear out any default blank dates in 'Auto Dismissed At' Column\cf2 \cb1 \strokec2 \
\cb4     \cf9 \strokec9 columnNumber\cf2 \strokec2  = \cf7 \strokec7 COL_DP_AUTO_DISMISSED_AT\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 dateCleanupRange\cf2 \strokec2  = \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf9 \strokec9 startRow\cf2 \strokec2 , \cf9 \strokec9 columnNumber\cf2 \strokec2 , \cf9 \strokec9 lastRow\cf2 \strokec2 , \cf11 \strokec11 1\cf2 \strokec2 );\cb1 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 values\cf2 \strokec2  = \cf9 \strokec9 dateCleanupRange\cf2 \strokec2 .\cf9 \strokec9 getValues\cf2 \strokec2 ();\cb1 \
\
\cb4     \cf5 \strokec5 // Iterate through the values and clear cells matching the target value\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 for\cf2 \strokec2  (\cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 i\cf2 \strokec2  = \cf11 \strokec11 0\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2  < \cf9 \strokec9 values\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2 ++) \{\cb1 \
\cb4       \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 values\cf2 \strokec2 [\cf9 \strokec9 i\cf2 \strokec2 ][\cf11 \strokec11 0\cf2 \strokec2 ].\cf9 \strokec9 getTime\cf2 \strokec2 () == \cf9 \strokec9 valueToDelete\cf2 \strokec2 .\cf9 \strokec9 getTime\cf2 \strokec2 ()) \{\cb1 \
\cb4         \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf9 \strokec9 i\cf2 \strokec2  + \cf9 \strokec9 startRow\cf2 \strokec2 , \cf9 \strokec9 columnNumber\cf2 \strokec2 ).\cf9 \strokec9 clearContent\cf2 \strokec2 ();\cb1 \
\cb4       \}\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cb1 \
\cb4     \cf5 \strokec5 //Clear out any default blank dates in 'Dismissed At' Column\cf2 \cb1 \strokec2 \
\cb4     \cf9 \strokec9 columnNumber\cf2 \strokec2  = \cf7 \strokec7 COL_DP_DISMISSED_AT\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 dateCleanupRange\cf2 \strokec2  = \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf9 \strokec9 startRow\cf2 \strokec2 , \cf9 \strokec9 columnNumber\cf2 \strokec2 , \cf9 \strokec9 lastRow\cf2 \strokec2 , \cf11 \strokec11 1\cf2 \strokec2 );\cb1 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 values\cf2 \strokec2  = \cf9 \strokec9 dateCleanupRange\cf2 \strokec2 .\cf9 \strokec9 getValues\cf2 \strokec2 ();\cb1 \
\
\cb4     \cf5 \strokec5 // Iterate through the values and clear cells matching the target value\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 for\cf2 \strokec2  (\cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 i\cf2 \strokec2  = \cf11 \strokec11 0\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2  < \cf9 \strokec9 values\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2 ++) \{\cb1 \
\cb4       \cf5 \strokec5 //ui.alert('SS value'+ values[i][0] + '   ::    Compares to ' + valueToDelete);\cf2 \cb1 \strokec2 \
\cb4       \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 values\cf2 \strokec2 [\cf9 \strokec9 i\cf2 \strokec2 ][\cf11 \strokec11 0\cf2 \strokec2 ].\cf9 \strokec9 getTime\cf2 \strokec2 () == \cf9 \strokec9 valueToDelete\cf2 \strokec2 .\cf9 \strokec9 getTime\cf2 \strokec2 ()) \{\cb1 \
\cb4         \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf9 \strokec9 i\cf2 \strokec2  + \cf9 \strokec9 startRow\cf2 \strokec2 , \cf9 \strokec9 columnNumber\cf2 \strokec2 ).\cf9 \strokec9 clearContent\cf2 \strokec2 ();  \cf5 \strokec5 //i+startRow since we are offsetting from the start row\cf2 \cb1 \strokec2 \
\cb4       \}\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cf5 \strokec5 //Clear out any default blank dates in 'Fixed At' Column\cf2 \cb1 \strokec2 \
\cb4     \cf9 \strokec9 columnNumber\cf2 \strokec2  = \cf7 \strokec7 COL_DP_FIXED_AT\cf2 \strokec2 ;\cb1 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 dateCleanupRange\cf2 \strokec2  = \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf9 \strokec9 startRow\cf2 \strokec2 , \cf9 \strokec9 columnNumber\cf2 \strokec2 , \cf9 \strokec9 lastRow\cf2 \strokec2 , \cf11 \strokec11 1\cf2 \strokec2 );\cb1 \
\cb4     \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 values\cf2 \strokec2  = \cf9 \strokec9 dateCleanupRange\cf2 \strokec2 .\cf9 \strokec9 getValues\cf2 \strokec2 ();\cb1 \
\
\cb4     \cf5 \strokec5 // Iterate through the values and clear cells matching the target value\cf2 \cb1 \strokec2 \
\cb4     \cf6 \strokec6 for\cf2 \strokec2  (\cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 i\cf2 \strokec2  = \cf11 \strokec11 0\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2  < \cf9 \strokec9 values\cf2 \strokec2 .\cf9 \strokec9 length\cf2 \strokec2 ; \cf9 \strokec9 i\cf2 \strokec2 ++) \{\cb1 \
\cb4       \cf6 \strokec6 if\cf2 \strokec2  (\cf9 \strokec9 values\cf2 \strokec2 [\cf9 \strokec9 i\cf2 \strokec2 ][\cf11 \strokec11 0\cf2 \strokec2 ].\cf9 \strokec9 getTime\cf2 \strokec2 () == \cf9 \strokec9 valueToDelete\cf2 \strokec2 .\cf9 \strokec9 getTime\cf2 \strokec2 ()) \{\cb1 \
\cb4         \cf9 \strokec9 sheet\cf2 \strokec2 .\cf9 \strokec9 getRange\cf2 \strokec2 (\cf9 \strokec9 i\cf2 \strokec2  + \cf9 \strokec9 startRow\cf2 \strokec2 , \cf9 \strokec9 columnNumber\cf2 \strokec2 ).\cf9 \strokec9 clearContent\cf2 \strokec2 ();\cb1 \
\cb4       \}\cb1 \
\cb4     \}\cb1 \
\
\cb4     \cb1 \
\
\
\cb4     \cf5 \strokec5 //Set Custom Formulas for this import \cf2 \cb1 \strokec2 \
\
\
\cb4     \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 showSidebar\cf2 \strokec2 (\cf7 \strokec7 HtmlService\cf2 \strokec2 .\cf9 \strokec9 createHtmlOutput\cf2 \strokec2 (\cf8 \strokec8 '<p>Import complete!</p>'\cf2 \strokec2 ).\cf9 \strokec9 setTitle\cf2 \strokec2 (\cf8 \strokec8 'Import Progress'\cf2 \strokec2 ));\cb1 \
\cb4     \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 alert\cf2 \strokec2 (\cf8 \strokec8 'Success'\cf2 \strokec2 , \cf8 \strokec8 'Vulnerability data has been imported successfully.'\cf2 \strokec2 , \cf9 \strokec9 ui\cf2 \strokec2 .\cf7 \strokec7 ButtonSet\cf2 \strokec2 .\cf7 \strokec7 OK\cf2 \strokec2 );\cb1 \
\
\cb4   \} \cf6 \strokec6 catch\cf2 \strokec2  (\cf9 \strokec9 e\cf2 \strokec2 ) \{\cb1 \
\cb4     \cf9 \strokec9 ui\cf2 \strokec2 .\cf9 \strokec9 alert\cf2 \strokec2 (\cf8 \strokec8 'Error'\cf2 \strokec2 , \cf9 \strokec9 e\cf2 \strokec2 .\cf9 \strokec9 message\cf2 \strokec2 , \cf9 \strokec9 ui\cf2 \strokec2 .\cf7 \strokec7 ButtonSet\cf2 \strokec2 .\cf7 \strokec7 OK\cf2 \strokec2 );\cb1 \
\cb4     \cf7 \strokec7 Logger\cf2 \strokec2 .\cf9 \strokec9 log\cf2 \strokec2 (\cf9 \strokec9 e\cf2 \strokec2 .\cf9 \strokec9 toString\cf2 \strokec2 ());\cb1 \
\cb4   \}\cb1 \
\cb4 \}\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 sheetName\cf2 \strokec2 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 return\cf2 \strokec2  \cf7 \strokec7 SpreadsheetApp\cf2 \strokec2 .\cf9 \strokec9 getActiveSpreadsheet\cf2 \strokec2 ().\cf9 \strokec9 getActiveSheet\cf2 \strokec2 ().\cf9 \strokec9 getName\cf2 \strokec2 ();\cb1 \
\cb4 \}\cb1 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \cb4 \strokec6 function\cf2 \strokec2  \cf9 \strokec9 testDates\cf2 \strokec2 () \{\cb1 \
\pard\pardeftab720\partightenfactor0
\cf2 \cb4   \cf6 \strokec6 var\cf2 \strokec2  \cf9 \strokec9 myDateToDelete\cf2 \strokec2  = \cf6 \strokec6 new\cf2 \strokec2  \cf7 \strokec7 Date\cf2 \strokec2 (\cf6 \strokec6 null\cf2 \strokec2 );\cb1 \
\cb4   \cf5 \strokec5 //return myDateToDelete;\cf2 \cb1 \strokec2 \
\cb4 \}\cb1 \
\
}