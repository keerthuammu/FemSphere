import fs from 'fs';

const testCases = [
  {
    caseNum: 1,
    tcId: 'TC_AUTH_01',
    banner: 'Patient Authentication Test Case',
    designedBy: 'KEERTHANA M',
    designedDate: '2026-10-16',
    priority: 'High',
    moduleName: 'Patient Authentication',
    executedBy: 'Amal K Jose',
    title: 'Verify Valid Patient Login & Dashboard Redirection',
    execDate: '2026-10-16',
    desc: 'Verifies that a registered female patient can successfully authenticate with valid credentials, receive a secure JWT token, and transition to the Patient Health Dashboard.',
    precond: 'User account is registered in PostgreSQL database and device has internet/ADB network connectivity.',
    postcond: 'User session is established with authenticated JWT token stored in secure storage.',
    steps: [
      {
        num: '1',
        step: 'Launch mobile application and navigate to Login screen',
        data: 'Package: com.example.femsphere',
        expected: 'App launches successfully and displays the Sign In screen with input fields',
        actual: 'App opened cleanly on Android 14; Sign In screen displayed',
        status: 'Pass'
      },
      {
        num: '2',
        step: 'Verify Email input field accessibility and placeholder',
        data: 'Field ID: login_email_input',
        expected: 'Email field is visible, focused, and accepts alphanumeric input',
        actual: 'Field located and ready for input',
        status: 'Pass'
      },
      {
        num: '3',
        step: 'Enter valid registered patient email address',
        data: 'Email: elena.rostova@femsphere.health',
        expected: 'Email address is typed accurately into the text field',
        actual: 'Email entered successfully',
        status: 'Pass'
      },
      {
        num: '4',
        step: 'Enter valid patient password',
        data: 'Password: Password123!',
        expected: 'Password text is masked securely and accepted',
        actual: 'Password characters masked and entered',
        status: 'Pass'
      },
      {
        num: '5',
        step: 'Click on the Login submit button',
        data: 'Element ID: login_submit_button',
        expected: 'Authentication request sent to backend API (POST /api/auth/login)',
        actual: 'HTTP 200 OK received with valid JWT Bearer token',
        status: 'Pass'
      },
      {
        num: '6',
        step: 'Verify transition to Patient Dashboard',
        data: 'View: Patient Dashboard',
        expected: 'User lands on Home Dashboard showing daily summary and health score',
        actual: 'Dashboard rendered with patient greeting and metrics',
        status: 'Pass'
      }
    ]
  },
  {
    caseNum: 2,
    tcId: 'TC_APP_06',
    banner: 'Appointment Confirmation Test Case',
    designedBy: 'KEERTHANA M',
    designedDate: '2026-10-16',
    priority: 'High',
    moduleName: 'Appointment Confirmation',
    executedBy: 'Amal K Jose',
    title: 'Verify Appointment Reservation Submission to Backend API',
    execDate: '2026-10-16',
    desc: 'Verifies that submitting appointment reservation dispatches a POST request to the backend API and confirms the booking with an appointment ID added to the calendar.',
    precond: 'Doctor, type, date, and slot configured in telehealth booking form.',
    postcond: 'Appointment record is persisted in backend database and synced to user schedule.',
    steps: [
      {
        num: '1',
        step: "Review booking details and click 'Confirm Booking'",
        data: 'Element ID: btn_confirm_booking',
        expected: 'POST request sent to /api/appointments/book',
        actual: 'Booking request dispatched',
        status: 'Pass'
      },
      {
        num: '2',
        step: 'Verify booking confirmation response',
        data: 'API Response: 201 Created',
        expected: 'Confirmation modal appears showing appointment ID and date',
        actual: 'Appointment confirmed with ID and added to calendar',
        status: 'Pass'
      }
    ]
  },
  {
    caseNum: 3,
    tcId: 'TC_WEAR_01',
    banner: 'Wearables Pairing Hub Test Case',
    designedBy: 'KEERTHANA M',
    designedDate: '2026-10-16',
    priority: 'High',
    moduleName: 'Wearables Pairing Hub',
    executedBy: 'Amal K Jose',
    title: 'Verify Opening Universal Wearable Pairing Interface',
    execDate: '2026-10-16',
    desc: 'Verifies that tapping the Pair New Device button launches the Universal Wearables Pairing Hub with active scanning options and category filters.',
    precond: 'FemSphere mobile companion app is running with Bluetooth permissions granted.',
    postcond: 'Wearables pairing interface is displayed and ready for peripheral detection.',
    steps: [
      {
        num: '1',
        step: "Tap 'Pair New Device' button in Wearables tab",
        data: 'Element ID: btn_open_wearables_scanner',
        expected: 'Universal pairing interface opens with scanner and scan options',
        actual: 'Pairing hub interface opened cleanly',
        status: 'Pass'
      }
    ]
  },
  {
    caseNum: 4,
    tcId: 'TC_TWIN_06',
    banner: 'Cycle Phase Prediction Test Case',
    designedBy: 'KEERTHANA M',
    designedDate: '2026-10-16',
    priority: 'High',
    moduleName: 'Cycle Phase Prediction',
    executedBy: 'Amal K Jose',
    title: 'Verify Menstrual Cycle Phase Prediction & 28-Day Baseline Calibration',
    execDate: '2026-10-16',
    desc: 'Verifies that the Digital Health Twin accurately predicts current biological phase and computes countdown days to the next expected menses.',
    precond: 'User menstrual cycle start date and baseline cadence are recorded.',
    postcond: 'Biological phase and timeline predictions are rendered on user dashboard.',
    steps: [
      {
        num: '1',
        step: 'View cycle phase prediction card',
        data: 'Element ID: cycle_phase_prediction_card',
        expected: 'Displays current biological phase and countdown to next expected menses',
        actual: 'Displays Follicular Phase; 18 days countdown rendered',
        status: 'Pass'
      }
    ]
  },
  {
    caseNum: 5,
    tcId: 'TC_REC_03',
    banner: 'Gemini AI OCR Engine Test Case',
    designedBy: 'KEERTHANA M',
    designedDate: '2026-10-16',
    priority: 'High',
    moduleName: 'Gemini AI OCR Engine',
    executedBy: 'Amal K Jose',
    title: 'Verify Gemini AI OCR Biomarker Extraction Table Rendering',
    execDate: '2026-10-16',
    desc: 'Verifies that the Gemini AI OCR engine extracts diagnostic lab biomarkers and renders structured tables with patient values and normal clinical reference ranges.',
    precond: 'Diagnostic medical report PDF has been processed by Gemini OCR service.',
    postcond: 'Clinical biomarkers are parsed, displayed, and synced with Digital Health Twin.',
    steps: [
      {
        num: '1',
        step: 'View scanned record details and AI biomarker analysis',
        data: 'Element ID: biomarker_results_table',
        expected: 'Structured table displays extracted biomarker names, patient values, and normal clinical reference ranges',
        actual: 'Biomarker table rendered with clinical reference ranges',
        status: 'Pass'
      }
    ]
  }
];

// GENERATE HTML
let casesHtml = '';
testCases.forEach((tc) => {
  let stepsHtml = '';
  tc.steps.forEach((s) => {
    stepsHtml += `        <tr>
          <td class="step-col">${s.num}</td>
          <td>${s.step}</td>
          <td>${s.data}</td>
          <td>${s.expected}</td>
          <td>${s.actual}</td>
          <td class="status-col">${s.status}</td>
        </tr>\n`;
  });

  casesHtml += `
  <div class="test-case-wrapper">
    <div class="test-case-title">Test Case ${tc.caseNum}</div>
    <div class="test-case-card">
      <div class="project-name-row">
        <strong>Project Name:</strong> FemSphere – Lifetime AI Health Twin Companion
      </div>
      <div class="banner-title-row">
        ${tc.banner}
      </div>

      <table class="meta-grid">
        <tr>
          <td class="col-left"><strong>Test Case ID:</strong> ${tc.tcId}</td>
          <td class="col-right"><strong>Test Designed By:</strong> ${tc.designedBy}</td>
        </tr>
        <tr>
          <td class="col-left"><strong>Test Priority(Low/Medium/High):</strong> ${tc.priority}</td>
          <td class="col-right"><strong>Test Designed Date:</strong> ${tc.designedDate}</td>
        </tr>
        <tr>
          <td class="col-left">
            <strong>Module Name:</strong> <span class="dropdown-box">&#9660;</span> ${tc.moduleName}
          </td>
          <td class="col-right"><strong>Test Executed By :</strong> ${tc.executedBy}</td>
        </tr>
        <tr>
          <td class="col-left"><strong>Test Title :</strong> ${tc.title}</td>
          <td class="col-right"><strong>Test Execution Date:</strong> ${tc.execDate}</td>
        </tr>
        <tr>
          <td class="col-left desc-label"><strong>Description:</strong></td>
          <td class="col-right desc-content">${tc.desc}</td>
        </tr>
      </table>

      <div class="precondition-row">
        <strong>Pre-Condition :</strong>${tc.precond}
      </div>

      <table class="steps-grid">
        <thead>
          <tr>
            <th style="width: 45px; text-align: center;">Step</th>
            <th style="width: 220px;">Test Step</th>
            <th style="width: 175px;">Test Data</th>
            <th style="width: 220px;">Expected Result</th>
            <th style="width: 220px;">Actual Result</th>
            <th style="width: 80px; text-align: center;">Status(Pass/<br>Fail)</th>
          </tr>
        </thead>
        <tbody>
${stepsHtml}        </tbody>
      </table>

      <div class="postcondition-row">
        <strong>Post-Condition:</strong> ${tc.postcond}
      </div>
    </div>
  </div>\n`;
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FemSphere - Test Execution Report (5 Vital Test Cases)</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      color: #000000;
      background: #ffffff;
      padding: 24px 32px;
      line-height: 1.4;
      font-size: 13px;
    }
    .report-container {
      max-width: 980px;
      margin: 0 auto;
    }
    .header-summary {
      margin-bottom: 25px;
      padding-bottom: 12px;
      border-bottom: 2px solid #000000;
    }
    .header-summary h1 {
      font-size: 20px;
      font-weight: bold;
      color: #000000;
      margin-bottom: 4px;
    }
    .header-summary p {
      font-size: 12.5px;
      color: #333333;
    }

    /* Test Case Block */
    .test-case-wrapper {
      margin-bottom: 38px;
      page-break-inside: avoid;
    }
    .test-case-title {
      font-size: 14.5px;
      font-weight: bold;
      color: #000000;
      margin-bottom: 6px;
      font-family: Arial, sans-serif;
    }
    .test-case-card {
      border: 2px solid #000000;
      background: #ffffff;
    }

    /* Project Name */
    .project-name-row {
      padding: 6px 10px;
      font-size: 13px;
      border-bottom: 1.5px solid #000000;
    }

    /* Banner / Test Case Title */
    .banner-title-row {
      text-align: center;
      font-weight: bold;
      font-size: 14px;
      padding: 7px 10px;
      border-bottom: 1.5px solid #000000;
      background: #ffffff;
    }

    /* 2-Column Meta Grid */
    .meta-grid {
      width: 100%;
      border-collapse: collapse;
    }
    .meta-grid td {
      border-bottom: 1px solid #000000;
      padding: 5px 10px;
      font-size: 12px;
      vertical-align: top;
      line-height: 1.4;
    }
    .col-left {
      width: 50%;
      border-right: 1.5px solid #000000;
    }
    .col-right {
      width: 50%;
    }
    .desc-label {
      vertical-align: top;
    }
    .desc-content {
      vertical-align: top;
    }

    .dropdown-box {
      display: inline-block;
      border: 1px solid #777777;
      background: #e2e2e2;
      padding: 0 4px;
      font-size: 8px;
      line-height: 12px;
      margin: 0 3px;
      vertical-align: middle;
      border-radius: 2px;
      cursor: default;
    }

    /* Pre-Condition */
    .precondition-row {
      padding: 6px 10px;
      font-size: 12px;
      border-bottom: 1.5px solid #000000;
      line-height: 1.4;
      background: #ffffff;
    }

    /* Steps Table */
    .steps-grid {
      width: 100%;
      border-collapse: collapse;
    }
    .steps-grid th {
      border-right: 1px solid #000000;
      border-bottom: 1.5px solid #000000;
      padding: 6px 8px;
      font-size: 11.5px;
      font-weight: bold;
      text-align: left;
      background-color: #ffffff;
      line-height: 1.25;
    }
    .steps-grid th:last-child {
      border-right: none;
    }
    .steps-grid td {
      border-right: 1px solid #000000;
      border-bottom: 1px solid #000000;
      padding: 5px 8px;
      font-size: 11.5px;
      vertical-align: top;
      line-height: 1.35;
    }
    .steps-grid td:last-child {
      border-right: none;
    }
    .steps-grid tr:last-child td {
      border-bottom: none;
    }
    .step-col {
      text-align: center;
      font-weight: 500;
    }
    .status-col {
      text-align: center;
      font-weight: bold;
    }

    /* Post-Condition */
    .postcondition-row {
      padding: 6px 10px;
      font-size: 12px;
      border-top: 1.5px solid #000000;
      line-height: 1.4;
      background: #ffffff;
    }

    @media print {
      body {
        padding: 8mm 6mm;
      }
      .test-case-wrapper {
        page-break-inside: avoid;
        margin-bottom: 25px;
      }
    }
  </style>
</head>
<body>

<div class="report-container">
  <div class="header-summary">
    <h1>FemSphere – Comprehensive Test Execution Verification Report</h1>
    <p><strong>Project Name:</strong> FemSphere – Lifetime AI Health Twin Companion Platform &bull; <strong>Lead QA:</strong> KEERTHANA M &bull; <strong>Executed By:</strong> Amal K Jose</p>
    <p><strong>Total Executed Test Cases:</strong> 5 &bull; <strong>Passed:</strong> 5 (100%) &bull; <strong>Failed:</strong> 0 &bull; <strong>Execution Date:</strong> October 16, 2026</p>
  </div>
${casesHtml}
</div>

</body>
</html>
`;

// GENERATE MARKDOWN
let mdContent = `# FemSphere – Comprehensive Test Execution Verification Report

**Project Name:** FemSphere – Lifetime AI Health Twin Companion Platform  
**Test Designed By:** KEERTHANA M (Lead Automation QA)  
**Test Executed By:** Amal K Jose  
**Test Execution Date:** October 16, 2026  
**Total Executed Test Cases:** 5 | **Passed:** 5 (100.0%) | **Failed:** 0  

---
`;

testCases.forEach((tc) => {
  mdContent += `
## Test Case ${tc.caseNum}

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### ${tc.banner}

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** ${tc.tcId} | **Test Designed By:** ${tc.designedBy} |
| **Test Priority(Low/Medium/High):** ${tc.priority} | **Test Designed Date:** ${tc.designedDate} |
| **Module Name:** [▼] ${tc.moduleName} | **Test Executed By :** ${tc.executedBy} |
| **Test Title :** ${tc.title} | **Test Execution Date:** ${tc.execDate} |
| **Description:** | ${tc.desc} |

**Pre-Condition :** ${tc.precond}

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
`;

  tc.steps.forEach((s) => {
    mdContent += `| ${s.num} | ${s.step.replace(/\|/g, '\\|')} | ${s.data.replace(/\|/g, '\\|')} | ${s.expected.replace(/\|/g, '\\|')} | ${s.actual.replace(/\|/g, '\\|')} | **${s.status}** |\n`;
  });

  mdContent += `
**Post-Condition:** ${tc.postcond}

---
`;
});

fs.writeFileSync('test/ALL_40_TEST_CASES_REPORT.html', htmlContent, 'utf8');
fs.writeFileSync('test/ALL_40_TEST_CASES_REPORT.md', mdContent, 'utf8');
console.log('Successfully aligned ALL_40_TEST_CASES_REPORT to match the 5 test cases of STEP_LOG_EXECUTION_REPORT!');
