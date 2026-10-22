# FemSphere - Vital Automated & Manual Test Cases Verification Report

**Project:** FemSphere - Lifetime AI Health Twin Companion Platform  
**Lead Automation Engineer:** KEERTHANA M  
**Test Executed By:** Amal K Jose  
**Total Executed Test Cases:** 5 | **Passed:** 5 (100%) | **Failed:** 0  

---

## Test Case 1: Patient Authentication

| Field | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority:** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Patient Authentication | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Valid Patient Login & Dashboard Redirection | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that a registered female patient can successfully authenticate with valid credentials and transition to the Patient Health Dashboard.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Launch mobile application and navigate to Login screen | Package: com.example.femsphere | App launches successfully and displays the Sign In screen with input fields | App opened cleanly on Android 14; Sign In screen displayed | **Pass** |
| 2 | Verify Email input field accessibility and placeholder | Field ID: login_email_input | Email field is visible, focused, and accepts alphanumeric input | Field located and ready for input | **Pass** |
| 3 | Enter valid registered patient email address | Email: elena.rostova@femsphere.health | Email address is typed accurately into the text field | Email entered successfully | **Pass** |
| 4 | Enter valid patient password | Password: Password123! | Password text is masked securely and accepted | Password characters masked and entered | **Pass** |
| 5 | Click on the Login submit button | Element ID: login_submit_button | Authentication request sent to backend API (POST /api/auth/login) | HTTP 200 OK received with valid JWT Bearer token | **Pass** |
| 6 | Verify transition to Patient Dashboard | View: Patient Dashboard | User lands on Home Dashboard showing daily summary and health score | Dashboard rendered with patient greeting and metrics | **Pass** |

---

## Test Case 2: Appointment Confirmation

| Field | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority:** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Appointment Confirmation | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Appointment Reservation Submission to Backend API | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that selecting doctor, consultation type, date, and time slot submits a valid booking reservation to the Express API (POST /api/appointments) and receives a confirmation token.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | From the appointment booking modal, verify all selection criteria | Doctor: Dr. Sarah Jenkins; Slot: 10:00 AM; Type: Virtual | Form displays selected doctor, date, time slot, and teleconsultation badge | Summary card accurately shows selected appointment details | **Pass** |
| 2 | Locate and click on the 'Confirm Booking' submission button | Element ID: btn_confirm_booking | Tap action is registered; loading spinner indicator displays on button | Tap registered; progress indicator visible | **Pass** |
| 3 | Monitor network payload for POST /api/appointments endpoint | Payload: { doctor_id: 1, date: '2026-10-12', slot: '10:00 AM' } | HTTP 201 Created status received with appointment confirmation ID | HTTP 201 Created received with unique confirmation ID #1042 | **Pass** |
| 4 | Verify appearance of Booking Confirmed success modal | Modal: Booking Success Dialog | Dialog appears with doctor name, teleconsultation link, and calendar add button | Success dialog rendered with appointment summary | **Pass** |
| 5 | Confirm newly booked consultation appears under Upcoming Appointments | List View: Upcoming Consultations | Teleconsultation appointment listed chronologically in directory | Appointment entry visible with 'Confirmed' green status badge | **Pass** |

---

## Test Case 3: Wearables Pairing Hub

| Field | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority:** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Wearables Pairing Hub | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Opening Universal Wearable Pairing Interface | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that the universal wearable pairing interface can be opened from the user profile or devices tab without permission crashes.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Navigate to the Connected Devices / Wearables view | Bottom Nav: Devices Tab | Wearables management screen displays paired devices and pairing CTA | Devices view rendered with 'Connect New Device' button | **Pass** |
| 2 | Tap on 'Connect New Wearable' button | Element ID: btn_open_wearables_scanner | Bottom sheet modal or pairing selection screen launches | Pairing hub opened | **Pass** |
| 3 | Verify presence of camera viewfinder scanner frame | Viewfinder Frame ID: qr_scanner_viewfinder | Live camera preview rectangle renders with scanning target overlay | Scanner frame loaded with active animated corner guides | **Pass** |
| 4 | Verify flashlight torch toggle button presence | Element ID: btn_toggle_torch | Torch icon button is displayed and interactive | Flashlight toggle button visible in top corner | **Pass** |
| 5 | Verify device category tabs render properly | Category: Smartwatches, Fitness Bands, Smart Rings | Category pills display horizontally with active filter styling | Category chips displayed cleanly without horizontal clipping | **Pass** |

---

## Test Case 4: Cycle Phase Prediction

| Field | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority:** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Cycle Phase Prediction | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Menstrual Cycle Phase Prediction & 28-Day Baseline Calibration | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that the Digital Health Twin calculates current menstrual cycle day, predicts upcoming fertile window and period onset, and displays hormonal phase recommendations.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Navigate to Period Tracker & Cycle Intelligence module | Bottom Nav: Cycle Tab | Cycle tracker dashboard displays circular phase gauge and cycle calendar | Menstrual cycle dashboard rendered with current day indicator | **Pass** |
| 2 | Verify current cycle day calculation from last period onset | Last Period: 14 days ago | System computes Cycle Day 14 (Ovulatory Phase window) | Cycle Day 14 displayed with 'High Fertility' indicator | **Pass** |
| 3 | Inspect next period start date prediction | Baseline: 28 days cycle | System predicts period onset in 14 days based on historical average | Next period countdown displayed: '14 days remaining' | **Pass** |
| 4 | Verify hormonal phase lifestyle and nutrition advice card | Phase: Ovulation Phase | Informational card recommends hydration, antioxidant nutrition, and light exercise | Nutrition and wellness recommendation cards loaded for Ovulatory phase | **Pass** |
| 5 | Confirm cycle calendar displays projected fertile days | Calendar View: Current Month | Fertile days highlighted with distinctive purple gradient markers | Calendar displays 5-day fertile window with correct visual badges | **Pass** |

---

## Test Case 5: Gemini AI OCR Engine

| Field | Details |
| :--- | :--- |
| **Test Case ID:** TC_REC_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority:** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Gemini AI OCR Engine | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Gemini AI OCR Biomarker Extraction Table Rendering | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that uploading a diagnostic lab report invokes Google Gemini multi-modal OCR, extracts structured biomarker data (Hb, TSH, Estrogen), and displays values in a clinical results table.

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | From the Medical Vault, locate previously uploaded CBC/Endocrine report | Document ID: #REC-4012 | Document card displays 'Scan with Gemini AI' button or 'OCR Processed' tag | Document card visible with OCR action button | **Pass** |
| 2 | Tap on 'View Biomarker Analysis' button | Element ID: btn_view_biomarkers | Structured biomarker drawer or results modal opens | Biomarker drawer slides open smoothly | **Pass** |
| 3 | Verify extracted biomarkers table renders with accurate parameters | Biomarkers: Hemoglobin, TSH, Serum Ferritin, Estradiol | Table lists Parameter, Measured Value, Unit, and Clinical Reference Range | Biomarker table rendered with all 4 extracted laboratory analytes | **Pass** |
| 4 | Verify visual color-coded flags for values within normal reference range | Normal Range Badge: Green; Elevated: Amber | Values within reference range show green badge; out-of-range show amber badge | Hemoglobin (13.2 g/dL - Normal) flagged with green status chip | **Pass** |
| 5 | Confirm 'Save to Health Timeline' action records biomarkers to PostgreSQL | Action: Save Extracted Data | Values stored in PostgreSQL health_reports table and reflected on timeline | Server returns HTTP 200; biomarkers mapped to patient longitudinal graph | **Pass** |
