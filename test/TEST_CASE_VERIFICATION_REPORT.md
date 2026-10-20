# FemSphere Project Verification Test Case Specification & Report

**Project:** FemSphere – Lifetime AI Health Twin Companion Platform  
**Target URL:** `http://localhost:3000`  
**API Backend:** `http://localhost:5001`  
**Test Automation Lead:** KEERTHANA M  
**Execution Date:** October 19, 2026  
**Overall Result:** ALL TEST CASES PASSED (Pass Rate: 100%)

---

## Test Case 1: Companion & Caregiver Connection Workflow

| **Project Verification Test Case** | |
| :--- | :--- |
| **Test Case ID:** TC_CG_CONN_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-18 |
| **Module Name:** Caregiver & Companion Sync | **Test Executed By:** KEERTHANA M |
| **Test Title:** Verify Female User to Caregiver Connection Request & Acceptance | **Test Execution Date:** 2026-10-19 |
| **Description:** Verifies that a female patient can search for a caregiver/companion by email, specify their relationship, send a consent-governed connection request, and verify that the request appears in the Caregiver portal for immediate review and acceptance. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Open browser and navigate to the application | `URL: http://localhost:3000/login` | Login page loads successfully with role selection | Page loaded successfully with all login options | **Pass** |
| **2** | Sign in with registered Female User account | `Email: mkeerthana2909@gmail.com`<br>`Password: ********` | Authenticated successfully; lands on User Dashboard | Successfully authenticated and redirected | **Pass** |
| **3** | Navigate to the Partner & Caregiver Sharing Module | `URL: http://localhost:3000/partner-sharing` | Search and connection management interface is displayed | Interface displayed with Search bar and Active connections list | **Pass** |
| **4** | Enter Caregiver's email in the Companion Search bar | `Search: sreejith24@gmail.com` | Caregiver profile `SREEJITH M (sreejith24@gmail.com)` is fetched and highlighted | Recipient card rendered with `Change Recipient` option | **Pass** |
| **5** | Select relationship with recipient from dropdown | `Relationship: Sibling` | Selected relationship is stored and displayed | "Sibling" selected from dropdown list | **Pass** |
| **6** | Click on "Send Connection Request" button | `Action: Click` | Request is sent to backend API (`POST /api/connections/request`), returning 201 Created | Success message displayed: "Connection request sent successfully to sreejith24@gmail.com. Awaiting acceptance." | **Pass** |
| **7** | Log out and switch to Caregiver account | `Action: Sign Out` | Current session is invalidated; redirected to login | Session ended cleanly | **Pass** |
| **8** | Log in with Caregiver account credentials | `Email: sreejith24@gmail.com`<br>`Password: ********`<br>`Role: Caregiver` | Authenticated into Caregiver Portal with badge counter | Landed on Caregiver Dashboard with pending badge count `1` | **Pass** |
| **9** | Navigate to Dependents / Connections section | `URL: http://localhost:3000/caregiver/dependents` | Incoming connection request card is visible under "Incoming Connection Requests" | Request card displayed: "KEERTHANA M (mkeerthana2909@gmail.com) • Stated Relationship: Sibling" | **Pass** |
| **10** | Verify action buttons on the request card | `Buttons: Accept Connection, Decline` | Both action buttons are active and clickable | "Accept Connection" and "Decline" buttons visible | **Pass** |
| **11** | Click "Accept Connection" button | `Action: Click Accept` | Request is accepted via `POST /api/connections/8/accept`; moves to Active Connections | Connection established; user card appears in Active Connections | **Pass** |

---

## Test Case 2: Period Tracker – Cycle Statistics & Lack of Period Calibration

| **Project Verification Test Case** | |
| :--- | :--- |
| **Test Case ID:** TC_PERIOD_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-18 |
| **Module Name:** Period Tracker & Cycle Intelligence | **Test Executed By:** KEERTHANA M |
| **Test Title:** Verify Average Cycle Recalibration (28 Days) & Delay Handling | **Test Execution Date:** 2026-10-19 |
| **Description:** Verifies that historical interval outliers (>38 days) are identified as menstrual delays rather than distorting average cycle calculations, ensuring Avg Cycle is clamped to the healthy 28-day baseline, and Maternity Mode is gated by marital status. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Log in as female patient with historical cycle delay | `User ID: 8 (mkeerthana2909@gmail.com)` | Successfully authenticated | User dashboard loaded | **Pass** |
| **2** | Open Period & Menstrual Cycle Tracker | `URL: http://localhost:3000/period-tracker` | Interactive cycle wheel and cadence estimates are rendered | Period Tracker loaded with database-synced data | **Pass** |
| **3** | Verify Average Cycle metric card | `Cadence & Estimates -> Avg Cycle` | Average Cycle displays `28 Days` with `Calibrated baseline` | Displayed `28 Days` (49-day gap excluded from cycle average) | **Pass** |
| **4** | Verify Next Expected Period countdown | `Countdown Center Wheel` | Countdown calculates based on 28-day baseline (`18 days until next period`) | Center wheel displays `18 days until your next period` | **Pass** |
| **5** | Verify Current Biological Phase display | `Phase Indicator` | Displays `FOLLICULAR PHASE` cleanly without conflicting delay warnings | `FOLLICULAR PHASE` badge displayed; misleading warning removed | **Pass** |
| **6** | Verify Marital Status gating on Maternity Mode | `Marital Status: Single` | Maternity Mode toggle/button is hidden for non-married users | Maternity Mode button is not rendered | **Pass** |

---

## Test Case 3: Admin Dashboard Verification

| **Project Verification Test Case** | |
| :--- | :--- |
| **Test Case ID:** TC_ADMIN_03 | **Test Designed By:** Abhilash K K |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-18 |
| **Module Name:** Admin Dashboard | **Test Executed By:** Ms. Merin Chacko |
| **Test Title:** Verify Project Verification features | **Test Execution Date:** 2026-10-19 |
| **Description:** Verifies that an Admin user can successfully log in and access the Project Verification queue, ensuring all required verification elements and keywords are present on the dashboard. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Open browser and navigate to login | `URL: http://localhost:3000/login` | Login page should load successfully | Browser opened and URL loaded | **Pass** |
| **2** | Click on the Sign In portal button | `Action: Click` | Portal options should become visible | "Sign In to Portal" clicked successfully | **Pass** |
| **3** | Select the user role tab | `Role: Admin` | Admin role should be selected | "Admin" role tab selected | **Pass** |
| **4** | Verify Email/User ID input field | `Element: Input Field` | Placeholder should match requirements | Placeholder: `john@freematch.ai or user1` | **Pass** |
| **5** | Enter valid Admin Email/User ID | `Email: admin@femsphere.org` | Email input should be accepted | Email/User ID entered | **Pass** |
| **6** | Enter valid Admin Password | `Password: ********` | Password input should be accepted | Password entered | **Pass** |
| **7** | Click the Login button | `Action: Submit` | User should be authenticated | Login button clicked | **Pass** |
| **8** | Verify post-login redirection URL | `Target: /admin` | User should land on the correct URL | Current URL: `http://localhost:3000/admin` | **Pass** |
| **9** | Verify the page title | `DOM: document.title` | Page title should match | Page title is "FemSphere - Admin Dashboard" | **Pass** |
| **10** | Verify Project Verification queue | `Element: Verification Queue Table` | Table loads pending verification items with actions | Queue rendered with Approve and Review controls | **Pass** |

---

## Test Case 4: Multi-Role Authentication & Access Control

| **Project Verification Test Case** | |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-18 |
| **Module Name:** Authentication & Access Control | **Test Executed By:** KEERTHANA M |
| **Test Title:** Verify Multi-Role Login & Route Protection (Patient, Doctor, Caregiver, Admin) | **Test Execution Date:** 2026-10-19 |
| **Description:** Verifies role-based access control, ensuring credentials authenticate users into their respective dedicated portals and unauthorized routes are blocked. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Navigate to login portal | `URL: http://localhost:3000/login` | Login screen renders role selector tabs | Role selector rendered | **Pass** |
| **2** | Submit invalid credentials | `Email: invalid@user.com`<br>`Password: wrong` | Authentication rejected with clear error alert | 401 Unauthorized; error message displayed | **Pass** |
| **3** | Authenticate as Clinical Doctor | `Role: Doctor`<br>`Email: doctor@femsphere.org` | Redirected to Clinical Consultation Hub (`/doctor`) | Doctor Dashboard loaded with Telehealth queue | **Pass** |
| **4** | Authenticate as Caregiver | `Role: Caregiver`<br>`Email: sreejith24@gmail.com` | Redirected to Caregiver Portal (`/caregiver`) | Caregiver Portal loaded with Dependents sync | **Pass** |
| **5** | Authenticate as Super Admin | `Role: Admin`<br>`Email: admin@femsphere.org` | Redirected to Super Admin Console (`/admin`) | Admin console loaded with system analytics | **Pass** |
| **6** | Verify Session Logout | `Action: Logout` | JWT token removed from storage; redirected to login | Token cleared; route guarded | **Pass** |
