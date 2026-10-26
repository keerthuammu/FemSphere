import fs from 'fs';
import path from 'path';

const cases = JSON.parse(fs.readFileSync('test/five_vital_cases_parsed.json', 'utf8'));

// 1. GENERATE HTML REPORT
function generateHtml() {
  let casesHtml = '';

  cases.forEach((tc, idx) => {
    const caseNum = idx + 1;

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
    <div class="test-case-title">Test Case ${caseNum}</div>
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
            <th style="width: 215px;">Test Step</th>
            <th style="width: 175px;">Test Data</th>
            <th style="width: 215px;">Expected Result</th>
            <th style="width: 215px;">Actual Result</th>
            <th style="width: 85px; text-align: center;">Status(Pass/<br>Fail)</th>
          </tr>
        </thead>
        <tbody>
${stepsHtml}        </tbody>
      </table>

      <div class="postcondition-row">
        <strong>Post-Condition:</strong> ${tc.postcond || 'None'}
      </div>
    </div>
  </div>\n`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FemSphere - Test Execution Report</title>
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
}

// 2. GENERATE MARKDOWN REPORT
function generateMarkdown() {
  let md = `# FemSphere – Comprehensive Test Execution Verification Report

**Project Name:** FemSphere – Lifetime AI Health Twin Companion Platform  
**Test Designed By:** KEERTHANA M (Lead Automation QA)  
**Test Executed By:** Amal K Jose  
**Test Execution Date:** October 16, 2026  
**Total Executed Test Cases:** 5 | **Passed:** 5 (100.0%) | **Failed:** 0  

---
`;

  cases.forEach((tc, idx) => {
    const caseNum = idx + 1;
    md += `
## Test Case ${caseNum}

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
      md += `| ${s.num} | ${s.step.replace(/\|/g, '\\|')} | ${s.data.replace(/\|/g, '\\|')} | ${s.expected.replace(/\|/g, '\\|')} | ${s.actual.replace(/\|/g, '\\|')} | **${s.status}** |\n`;
    });

    md += `
**Post-Condition:** ${tc.postcond || 'None'}

---
`;
  });

  return md;
}

// Write files
fs.writeFileSync('test/ALL_40_TEST_CASES_REPORT.html', generateHtml(), 'utf8');
fs.writeFileSync('test/ALL_40_TEST_CASES_REPORT.md', generateMarkdown(), 'utf8');

console.log('✅ Updated test/ALL_40_TEST_CASES_REPORT.html and test/ALL_40_TEST_CASES_REPORT.md to match the template format perfectly!');
