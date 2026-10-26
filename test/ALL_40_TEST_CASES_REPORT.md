# FemSphere – Comprehensive Test Execution Verification Report

**Project Name:** FemSphere – Lifetime AI Health Twin Companion Platform  
**Test Designed By:** KEERTHANA M (Lead Automation QA)  
**Test Executed By:** Amal K Jose  
**Test Execution Date:** October 16, 2026  
**Total Executed Test Cases:** 5 | **Passed:** 5 (100.0%) | **Failed:** 0  

---

## Test Case 1

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Patient Authentication Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** [▼] Patient Authentication | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Valid Patient Login & Dashboard Redirection | **Test Execution Date:** 2026-10-16 |
| **Description:** | Verifies that a registered female patient can successfully authenticate with valid credentials, receive a secure JWT token, and transition to the Patient Health Dashboard. |

**Pre-Condition :** User account is registered in PostgreSQL database and device has internet/ADB network connectivity.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Launch mobile application and navigate to Login screen | Package: com.example.femsphere | App launches successfully and displays the Sign In screen with input fields | App opened cleanly on Android 14; Sign In screen displayed | **Pass** |
| 2 | Verify Email input field accessibility and placeholder | Field ID: login_email_input | Email field is visible, focused, and accepts alphanumeric input | Field located and ready for input | **Pass** |
| 3 | Enter valid registered patient email address | Email: elena.rostova@femsphere.health | Email address is typed accurately into the text field | Email entered successfully | **Pass** |
| 4 | Enter valid patient password | Password: Password123! | Password text is masked securely and accepted | Password characters masked and entered | **Pass** |
| 5 | Click on the Login submit button | Element ID: login_submit_button | Authentication request sent to backend API (POST /api/auth/login) | HTTP 200 OK received with valid JWT Bearer token | **Pass** |
| 6 | Verify transition to Patient Dashboard | View: Patient Dashboard | User lands on Home Dashboard showing daily summary and health score | Dashboard rendered with patient greeting and metrics | **Pass** |

**Post-Condition:** User session is established with authenticated JWT token stored in secure storage.

---

## Test Case 2

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Appointment Confirmation Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** [▼] Appointment Confirmation | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Appointment Reservation Submission to Backend API | **Test Execution Date:** 2026-10-16 |
| **Description:** | Verifies that submitting appointment reservation dispatches a POST request to the backend API and confirms the booking with an appointment ID added to the calendar. |

**Pre-Condition :** Doctor, type, date, and slot configured in telehealth booking form.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Review booking details and click 'Confirm Booking' | Element ID: btn_confirm_booking | POST request sent to /api/appointments/book | Booking request dispatched | **Pass** |
| 2 | Verify booking confirmation response | API Response: 201 Created | Confirmation modal appears showing appointment ID and date | Appointment confirmed with ID and added to calendar | **Pass** |

**Post-Condition:** Appointment record is persisted in backend database and synced to user schedule.

---

## Test Case 3

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Wearables Pairing Hub Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** [▼] Wearables Pairing Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Opening Universal Wearable Pairing Interface | **Test Execution Date:** 2026-10-16 |
| **Description:** | Verifies that tapping the Pair New Device button launches the Universal Wearables Pairing Hub with active scanning options and category filters. |

**Pre-Condition :** FemSphere mobile companion app is running with Bluetooth permissions granted.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Tap 'Pair New Device' button in Wearables tab | Element ID: btn_open_wearables_scanner | Universal pairing interface opens with scanner and scan options | Pairing hub interface opened cleanly | **Pass** |

**Post-Condition:** Wearables pairing interface is displayed and ready for peripheral detection.

---

## Test Case 4

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Cycle Phase Prediction Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** [▼] Cycle Phase Prediction | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Menstrual Cycle Phase Prediction & 28-Day Baseline Calibration | **Test Execution Date:** 2026-10-16 |
| **Description:** | Verifies that the Digital Health Twin accurately predicts current biological phase and computes countdown days to the next expected menses. |

**Pre-Condition :** User menstrual cycle start date and baseline cadence are recorded.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | View cycle phase prediction card | Element ID: cycle_phase_prediction_card | Displays current biological phase and countdown to next expected menses | Displays Follicular Phase; 18 days countdown rendered | **Pass** |

**Post-Condition:** Biological phase and timeline predictions are rendered on user dashboard.

---

## Test Case 5

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Gemini AI OCR Engine Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_REC_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** [▼] Gemini AI OCR Engine | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Gemini AI OCR Biomarker Extraction Table Rendering | **Test Execution Date:** 2026-10-16 |
| **Description:** | Verifies that the Gemini AI OCR engine extracts diagnostic lab biomarkers and renders structured tables with patient values and normal clinical reference ranges. |

**Pre-Condition :** Diagnostic medical report PDF has been processed by Gemini OCR service.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | View scanned record details and AI biomarker analysis | Element ID: biomarker_results_table | Structured table displays extracted biomarker names, patient values, and normal clinical reference ranges | Biomarker table rendered with clinical reference ranges | **Pass** |

**Post-Condition:** Clinical biomarkers are parsed, displayed, and synced with Digital Health Twin.

---
