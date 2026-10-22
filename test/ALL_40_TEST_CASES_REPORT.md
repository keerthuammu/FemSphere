# Test Report

**Project Name:** FemSphere – Lifetime AI Health Twin Companion Platform  
**Lead QA Automation Engineer:** KEERTHANA M  
**Execution Date:** October 16, 2026  
**Total Executed Tests:** 40 | **Passed:** 40 (100%) | **Failed:** 0  

---

### Test Case 1

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Authentication Test Case** | |
| **Test Case ID:** TC_AUTH_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Patient Authentication | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Valid Patient Login & Dashboard Redirection | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that a registered female patient can successfully authenticate with valid credentials and transition to the Patient Health Dashboard. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Launch mobile application and navigate to Login screen | Package: com.example.femsphere | App launches successfully and displays the Sign In screen with input fields | App opened cleanly on Android 14; Sign In screen displayed | **Pass** |
| **2** | Verify Email input field accessibility and placeholder | Field ID: login_email_input | Email field is visible, focused, and accepts alphanumeric input | Field located and ready for input | **Pass** |
| **3** | Enter valid registered patient email address | Email: elena.rostova@femsphere.health | Email address is typed accurately into the text field | Email entered successfully | **Pass** |
| **4** | Enter valid patient password | Password: Password123! | Password text is masked securely and accepted | Password characters masked and entered | **Pass** |
| **5** | Click on the Login submit button | Element ID: login_submit_button | Authentication request sent to backend API (POST /api/auth/login) | HTTP 200 OK received with valid JWT Bearer token | **Pass** |
| **6** | Verify transition to Patient Dashboard | View: Patient Dashboard | User lands on Home Dashboard showing daily summary and health score | Dashboard rendered with patient greeting and metrics | **Pass** |

---

### Test Case 2

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Authentication Security Test Case** | |
| **Test Case ID:** TC_AUTH_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Patient Authentication | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Invalid Credentials Rejection & Alert Notification | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that unauthorized access attempts with invalid email or incorrect password are immediately rejected with appropriate feedback and no token generation. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Navigate to the Login screen | Screen: Login | Login interface is presented to the user | Login screen loaded | **Pass** |
| **2** | Enter unverified / unregistered email address | Email: invalid@user.com | Input field accepts string | Invalid email string entered | **Pass** |
| **3** | Enter incorrect password | Password: BadPassword | Password entered | Bad password entered | **Pass** |
| **4** | Click on the Login submit button | Action: Click Submit | Backend returns 401 Unauthorized; error message displayed to user | HTTP 401 returned; snackbar displays 'Invalid email or password' | **Pass** |
| **5** | Verify user remains on Login screen | Element ID: login_submit_button | User is not authenticated; login button remains visible and interactive | Login button remains displayed; session token not created | **Pass** |

---

### Test Case 3

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Role-Based Access Test Case** | |
| **Test Case ID:** TC_AUTH_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Super Admin Portal | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Admin Superuser Portal Login & Route Authorization | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that an administrator superuser can authenticate and is routed specifically to the Super Admin management console with full administrative privileges. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Open application and select role tab if available | Role: Admin | Login portal configures for administrative authentication | Admin portal selected | **Pass** |
| **2** | Enter authorized Admin superuser email | Email: admin@femsphere.health | Admin email accepted by field validator | Admin email entered | **Pass** |
| **3** | Enter valid Admin security password | Password: ******** | Password accepted | Password entered securely | **Pass** |
| **4** | Click Login submit button | Action: Submit | Authentication successful; role parsed as 'Admin' | JWT payload contains role: 'Admin' | **Pass** |
| **5** | Verify landing on Super Admin Console | View: Admin Dashboard | Admin management dashboard renders with system metrics and verification queue | Super Admin Console loaded with audit and queue controls | **Pass** |

---

### Test Case 4

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Clinical Role Access Test Case** | |
| **Test Case ID:** TC_AUTH_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Doctor Clinical Portal | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Doctor Clinical Portal Login & Schedule Access | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that licensed clinicians and doctors can log in and land on the Clinical Telehealth Workspace with access to patient appointments. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Open login view and enter Doctor credentials | Email: dr.jenkins@femsphere.health | Doctor email accepted into input field | Doctor email entered | **Pass** |
| **2** | Enter doctor account password | Password: ******** | Password accepted | Password entered | **Pass** |
| **3** | Submit login form | Action: Submit | Server authenticates clinician and returns clinical scope token | HTTP 200 OK; clinician profile resolved | **Pass** |
| **4** | Verify redirection to Clinical Dashboard | View: Doctor Workspace | Clinical dashboard opens showing scheduled appointments and patient records | Doctor Workspace loaded with consultation queues | **Pass** |

---

### Test Case 5

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Caregiver Role Access Test Case** | |
| **Test Case ID:** TC_AUTH_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Portal | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Caregiver Multi-Dependent Portal Authentication | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that a registered caregiver can log into the Caregiver portal and view linked dependents and connection requests. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Enter Caregiver account email | Email: caregiver@femsphere.health | Caregiver email entered into email field | Email entered | **Pass** |
| **2** | Enter Caregiver password | Password: ******** | Password accepted | Password entered | **Pass** |
| **3** | Submit login credentials | Action: Submit | Authenticated with Caregiver permissions | HTTP 200 OK; caregiver record loaded | **Pass** |
| **4** | Verify Caregiver Portal landing view | View: Caregiver Portal | Caregiver dashboard renders with dependent profiles and connection tabs | Caregiver Dashboard rendered with dependent cards and sync tabs | **Pass** |

---

### Test Case 6

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Infrastructure Connectivity Test Case** | |
| **Test Case ID:** TC_AUTH_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Backend API Bridge | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify ADB Socket TCP Loopback Connectivity on Port 5001 | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies low-level TCP loopback socket connectivity between Android test runner and local Express REST API server on port 5001. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Initialize low-level TCP socket client | Protocol: TCP / IPv4 | Socket resource initialized in test harness | Socket initialized cleanly | **Pass** |
| **2** | Set socket connection timeout threshold | Timeout: 2.0 seconds | Timeout registered on socket descriptor | Timeout applied | **Pass** |
| **3** | Attempt TCP handshake with localhost backend port | Target: 127.0.0.1:5001 | Connection established or loopback accepted (Socket code 0 / standard return) | Socket connection returned valid response code (0) | **Pass** |
| **4** | Gracefully terminate socket session | Action: socket.close() | Socket closed without orphan file descriptors | Socket connection closed cleanly | **Pass** |

---

### Test Case 7

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Session Management Test Case** | |
| **Test Case ID:** TC_AUTH_07 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Session Security | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Logout Session Invalidation & Token Clearance | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that clicking logout revokes local authentication tokens, clears encrypted session storage, and routes back to the Login screen. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Navigate to User Profile & Settings tab | Tab: Profile | Profile and account management controls render | Profile screen rendered | **Pass** |
| **2** | Locate and click the Logout action button | Element ID: profile_logout_button | Logout confirmation modal or immediate signout triggers | Logout button clicked successfully | **Pass** |
| **3** | Verify secure token eradication | Storage: JWT Token Storage | femsphere_token cleared from secure storage | Token removed; secure storage cleared | **Pass** |
| **4** | Verify redirection to Login portal | View: Login | App returns to initial Login screen; back button cannot access dashboard | Login screen displayed; protected routes locked | **Pass** |

---

### Test Case 8

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Telehealth Directory Test Case** | |
| **Test Case ID:** TC_APP_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Consultations Directory | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Telehealth Consultations Directory Rendering | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that navigating to the Consultations tab loads the verified doctors directory with specializations, ratings, and booking triggers. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap on the Consultations navigation item in bottom bar | Accessibility ID: tab_consultations | Consultations directory view opens | Navigated to Consultations tab successfully | **Pass** |
| **2** | Verify doctors list rendering | Element: Doctor Directory List | List of qualified gynecologists and specialists is displayed | Doctor cards rendered with photos, specializations, and availability | **Pass** |

---

### Test Case 9

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Modal Interaction Test Case** | |
| **Test Case ID:** TC_APP_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Appointment Booking | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Booking Bottom Sheet Modal Opens Smoothly | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that tapping 'Book Appointment' triggers the responsive bottom sheet modal with date, doctor, and slot selectors. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Locate 'Book Appointment' button on selected doctor card | Element ID: btn_book_appointment | Button is visible and interactive | Button located on doctor card | **Pass** |
| **2** | Tap 'Book Appointment' button | Action: Tap | Interactive bottom sheet modal slides up over the screen | Booking bottom sheet modal opened cleanly | **Pass** |

---

### Test Case 10

| **Project Name: FemSphere** | |
| :--- | :--- |
| **UI Layout Integrity Test Case** | |
| **Test Case ID:** TC_APP_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Doctor Selection | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Doctor Dropdown Selector Expands Without Layout Overflow | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that expanding the doctor selection dropdown renders all doctor options without text clipping or Flutter RenderFlex overflow errors. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Locate doctor dropdown selector inside booking modal | Element ID: doctor_dropdown_selector | Dropdown element is displayed | Doctor dropdown located | **Pass** |
| **2** | Tap to expand doctor options list | Action: Tap | Dropdown expands smoothly displaying doctor names and fees | Dropdown expanded with 0 overflow warnings | **Pass** |

---

### Test Case 11

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Mode Toggle Test Case** | |
| **Test Case ID:** TC_APP_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Consultation Type | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Consultation Type Toggle (Virtual Telehealth vs In-Clinic) | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies switching between Video Consultation (WebRTC) and In-Clinic visit formats updates appointment requirements accordingly. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Locate consultation type segmented control / toggle | Element ID: appointment_type_toggle | Toggle displays 'Virtual Video' and 'In-Clinic Visit' options | Toggle displayed with both options | **Pass** |
| **2** | Tap to switch to 'In-Clinic Visit' | Action: Tap | Selected mode switches; clinic address details appear | Active option toggled to In-Clinic Visit | **Pass** |
| **3** | Tap back to 'Virtual Video Call' | Action: Tap | Switches to Virtual Telehealth mode with video call link notes | Active option toggled to Virtual Video Call | **Pass** |

---

### Test Case 12

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Capacity & Slot Test Case** | |
| **Test Case ID:** TC_APP_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Time Slot Selection | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Available Time Slot Selection & Capacity Management | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that selecting an available appointment slot pill highlights the selection and checks real-time slot availability. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | View available time slot pills for selected date | Slots: Morning / Afternoon | Grid of time slot pills is rendered with availability states | Time slots rendered | **Pass** |
| **2** | Tap on '10:00 AM' slot pill | Element ID: slot_10_00_am | Slot pill is highlighted with primary purple theme color | Slot 10:00 AM highlighted and selected | **Pass** |

---

### Test Case 13

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Booking Submission Test Case** | |
| **Test Case ID:** TC_APP_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Appointment Confirmation | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Appointment Reservation Submission to Backend API | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that confirming an appointment reservation submits booking details to the PostgreSQL database and returns confirmation. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Review booking details and click 'Confirm Booking' | Element ID: btn_confirm_booking | POST request sent to /api/appointments/book | Booking request dispatched | **Pass** |
| **2** | Verify booking confirmation response | API Response: 201 Created | Confirmation modal appears showing appointment ID and date | Appointment confirmed with ID and added to calendar | **Pass** |

---

### Test Case 14

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Wearable Navigation Test Case** | |
| **Test Case ID:** TC_WEAR_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Wearables Pairing Hub | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Opening Universal Wearable Pairing Interface | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies accessing the universal wearable pairing interface to discover Bluetooth and QR-based fitness watches. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap 'Pair New Device' button in Wearables tab | Element ID: btn_open_wearables_scanner | Universal pairing interface opens with scanner and scan options | Pairing hub interface opened cleanly | **Pass** |

---

### Test Case 15

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Camera & Vision Test Case** | |
| **Test Case ID:** TC_WEAR_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Live QR Scanner | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Live GPay-Style Camera Viewfinder Feed for QR Scanning | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies camera viewfinder frame renders active video feed with target scanning reticle matching GPay-style design. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Initialize camera preview for QR code scanning | Element ID: qr_scanner_viewfinder | Camera feed streams in viewfinder frame with laser reticle animation | Viewfinder active with animated scanning reticle | **Pass** |

---

### Test Case 16

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Device Categorization Test Case** | |
| **Test Case ID:** TC_WEAR_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Wearable Filter Chips | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Smart Audio & Earbuds Noise Filtering Category Chip | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies device filter chips allow isolating smart audio hearing health devices from smartwatch trackers. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap on 'Smart Earbuds / Audio' filter chip | Element ID: chip_filter_earbuds | Device list filters to show audio hearing wearables and decibel sensors | Filter applied; audio earbuds devices listed | **Pass** |

---

### Test Case 17

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Bluetooth Discovery Test Case** | |
| **Test Case ID:** TC_WEAR_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE Scanner | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Direct Bluetooth Low Energy (BLE) Scan Navigation | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies starting active Bluetooth Low Energy peripheral scan for nearby health bands without needing proprietary apps. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap 'Scan Bluetooth Devices' button | Element ID: btn_scan_bluetooth | Android BLE discovery starts searching for standard GATT peripherals | Bluetooth scan active; discovered peripherals listed | **Pass** |

---

### Test Case 18

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Quick Pairing Test Case** | |
| **Test Case ID:** TC_WEAR_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Device Profiles | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Quick Demo Pairing with boAt Wave Beat Telemetry Watch | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies quick-pair profile establishment with boAt Wave Beat smart watch for heart rate and step ingestion. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Select 'boAt Wave Beat' from discovered devices list | Element ID: device_boat_wave_beat | Device row selected and pairing handshake initiated | Device row located and simulated pairing successful | **Pass** |

---

### Test Case 19

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Quick Pairing Test Case** | |
| **Test Case ID:** TC_WEAR_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Device Profiles | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Quick Demo Pairing with Amazfit Bip U Pro Biometric Tracker | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies quick-pair profile establishment with Amazfit Bip U Pro tracker for SpO2 and continuous vitals. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Select 'Amazfit Bip U Pro' from discovered devices list | Element ID: device_amazfit_bip_u_pro | Biometric profile registered in user device table | Device registered as active biometric source | **Pass** |

---

### Test Case 20

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Hardware Control Test Case** | |
| **Test Case ID:** TC_WEAR_07 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Low | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Camera Torch | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Camera Flashlight/Torch Toggle Controller in Scanner | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies camera torch illumination toggle for scanning wearable QR codes in low-ambient lighting environments. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap flashlight torch toggle icon in scanner overlay | Element ID: btn_toggle_torch | Device camera LED torch turns ON; icon changes to active state | Torch toggled ON cleanly | **Pass** |
| **2** | Tap flashlight torch toggle icon again | Action: Tap | Device camera LED torch turns OFF; icon returns to inactive state | Torch toggled OFF cleanly | **Pass** |

---

### Test Case 21

| **Project Name: FemSphere** | |
| :--- | :--- |
| **AI Health Twin Test Case** | |
| **Test Case ID:** TC_TWIN_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Health Twin Score | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Aggregate Digital Health Twin Score Indicator Rendering | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies multi-metric biometric scoring calculation synthesizing sleep, hydration, cycle rhythm, and pain into unified health score. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Navigate to Digital Health Twin screen | View: Health Twin | Aggregate score ring and biometric parameters display | Health Twin score card displayed (e.g. 88/100 Vitality) | **Pass** |

---

### Test Case 22

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Daily Logging Test Case** | |
| **Test Case ID:** TC_TWIN_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Hydration Tracker | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Daily Water Intake Counter Increment (+250ml) | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies incrementing daily water intake counter increases logged milliliters and updates daily hydration progress bar. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap '+250ml' hydration increment button | Element ID: btn_increment_water | Water level counter increments by 250ml with subtle wave animation | Counter incremented from 1500ml to 1750ml | **Pass** |

---

### Test Case 23

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Numeric Input Test Case** | |
| **Test Case ID:** TC_TWIN_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Sleep Tracking | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Sleep Duration Numeric Input & Biometric Logging | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies entering total nightly sleep hours in numeric format and calculating restorative sleep metrics. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Enter total hours of sleep | Input: 7.5 (Element ID: input_sleep_duration) | Input field accepts floating point value 7.5 hours | Value 7.5 recorded in sleep input field | **Pass** |

---

### Test Case 24

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Symptom Logging Test Case** | |
| **Test Case ID:** TC_TWIN_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Mood & Energy | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Psychosomatic Mood & Energy Level Selector | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies selecting daily mood chips (Calm, Energetic, Fatigued, Irritable) updates emotional baseline for cycle correlation. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Select 'Calm' mood chip | Element ID: chip_mood_calm | 'Calm' chip is highlighted and recorded as daily mood state | Chip selected and recorded in daily state | **Pass** |

---

### Test Case 25

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Slider Control Test Case** | |
| **Test Case ID:** TC_TWIN_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Pain Scale | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify VAS Pelvic & Cramping Pain Scale Slider Adjustment | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies adjusting Visual Analog Scale (VAS) 0–10 pelvic pain slider records severity and suggests non-pharmacological relief tips. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Adjust pain scale slider from 0 to 4 (Mild/Moderate) | Element ID: slider_pelvic_pain | Slider value updates to 4; pain level caption changes to Moderate Cramping | Slider adjusted to 4; relief tips updated | **Pass** |

---

### Test Case 26

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Clinical Cycle Intelligence Test Case** | |
| **Test Case ID:** TC_TWIN_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Cycle Phase Prediction | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Menstrual Cycle Phase Prediction & 28-Day Baseline Calibration | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies cycle prediction engine calculates current biological phase (Follicular/Ovulatory/Luteal) based on calibrated 28-day baseline without delay distortions. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | View cycle phase prediction card | Element ID: cycle_phase_prediction_card | Displays current biological phase and countdown to next expected menses | Displays Follicular Phase; 18 days countdown rendered | **Pass** |

---

### Test Case 27

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Database Sync Test Case** | |
| **Test Case ID:** TC_TWIN_07 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Vitals Synchronization | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Saving Daily Health Vitals Log & Backend PostgreSQL Sync | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies saving daily health log sends payload to /api/health-twin/log and persists into period_daily_logs table. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap 'Save Daily Vitals' button | Element ID: btn_save_daily_vitals | Data synced to PostgreSQL; success toast displayed | HTTP 200 OK; synced with database successfully | **Pass** |

---

### Test Case 28

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Caregiver Dashboard Test Case** | |
| **Test Case ID:** TC_CG_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Overview | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Caregiver Multi-Dependent Dashboard Overview Rendering | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that Caregiver Overview card displays summary statistics for linked dependents, upcoming appointments, and pending connection requests. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Open Caregiver Dashboard overview | Element ID: caregiver_overview_card | Overview metrics card displays total dependents and pending sync tasks | Caregiver overview card rendered with full metrics | **Pass** |

---

### Test Case 29

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Profile Switching Test Case** | |
| **Test Case ID:** TC_CG_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Dependent Switcher | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Switching Active Dependent Profile in Caregiver Vault | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies selecting a different dependent from the dropdown switches the active health context, medical records, and medication schedules. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap dependent selection dropdown | Element ID: switch_dependent_dropdown | List of authorized dependents expands | Dropdown expanded with dependent list | **Pass** |
| **2** | Select alternate dependent | Selection: Second Dependent | Dashboard context switches to the selected dependent's medical vault | Active profile switched; records reloaded for selected profile | **Pass** |

---

### Test Case 30

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Medication Reminder Test Case** | |
| **Test Case ID:** TC_CG_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Prescription Reminders | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Prescription Medication Dosage Reminder Creation | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies adding a prescription dosage reminder with drug name, dosage, time, and frequency saves into the medication schedule. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap 'Add Medication' button | Element ID: btn_add_medication | Medication creation form/modal opens | Add medication modal displayed | **Pass** |
| **2** | Enter medication details and save | Medicine: Amoxicillin 500mg, Time: 08:00 AM | Medication recorded in database and appears in daily timeline | Medication reminder created and scheduled | **Pass** |

---

### Test Case 31

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Immunization Test Case** | |
| **Test Case ID:** TC_CG_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Vaccination Tracker | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Immunization & Vaccination Schedule Tracker Access | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies accessing immunization timeline for dependent showing completed vaccines and upcoming booster due dates. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap on Vaccinations tab in Caregiver navigation | Element ID: tab_vaccinations | Vaccination schedule timeline loads with administered and upcoming doses | Immunization table rendered with due dates | **Pass** |

---

### Test Case 32

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Medical Vault Test Case** | |
| **Test Case ID:** TC_REC_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Diagnostic Records | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Access to Patient Diagnostic Medical Records Vault | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies patient can open the encrypted diagnostic medical vault and view categorical lab reports and imaging files. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap Medical Records tab in bottom navigation | Element ID: tab_medical_records | Medical records vault opens listing categorized lab reports | Records vault loaded with categories (Blood, Imaging, Pathology) | **Pass** |

---

### Test Case 33

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Document Upload Test Case** | |
| **Test Case ID:** TC_REC_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Record Upload | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Document Upload Bottom Sheet Modal Access | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies tapping upload opens the document attachment bottom sheet with Camera capture and PDF file picker options. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap 'Upload Medical Record' floating action button | Element ID: btn_upload_medical_record | Upload bottom sheet modal appears with PDF and Camera selectors | Upload modal displayed with file attachment controls | **Pass** |

---

### Test Case 34

| **Project Name: FemSphere** | |
| :--- | :--- |
| **AI OCR Biomarker Test Case** | |
| **Test Case ID:** TC_REC_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Gemini AI OCR Engine | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Gemini AI OCR Biomarker Extraction Table Rendering | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies that AI OCR parsing of uploaded lab reports extracts biomarker values (e.g. Hemoglobin, TSH, Estrogen) into a structured comparison table. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | View scanned record details and AI biomarker analysis | Element ID: biomarker_results_table | Structured table displays extracted biomarker names, patient values, and normal clinical reference ranges | Biomarker table rendered with clinical reference ranges | **Pass** |

---

### Test Case 35

| **Project Name: FemSphere** | |
| :--- | :--- |
| **File Viewer Test Case** | |
| **Test Case ID:** TC_REC_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Report Viewer | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Lab Diagnostic Report File Attachment Viewer & Download | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies opening the high-resolution PDF/image viewer to inspect original diagnostic lab report documents. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Tap 'View Original Report' button on record card | Element ID: btn_view_report_file | Attachment viewer opens displaying the diagnostic document with zoom and download controls | Report viewer opened and displayed file content | **Pass** |

---

### Test Case 36

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Hardware Protocol Test Case** | |
| **Test Case ID:** TC_BLE_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE Service Discovery | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Direct BLE GATT Service Discovery on Android Peripheral Manager | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies discovery of standard Bluetooth SIG health profiles directly on Android BluetoothAdapter without manufacturer middleware. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Verify BLE service discovery status on connected band | Element ID: ble_service_discovery_indicator | Service discovery indicator confirms primary GATT services resolved (0x180D, 0x180F) | Primary GATT health services discovered and active | **Pass** |

---

### Test Case 37

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Zero-Dependency Test Case** | |
| **Test Case ID:** TC_BLE_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Standalone Telemetry | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Telemetry Streaming Operates Without Vendor OEM Companion Apps | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies standalone architecture ingests continuous sensor packets without requiring Xiaomi, Noise, or boAt proprietary companion apps. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Verify Standalone BLE mode status badge | Element ID: badge_standalone_ble | Badge confirms 'Standalone BLE - Zero OEM App Required' | Standalone badge visible and active | **Pass** |

---

### Test Case 38

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Reliability Test Case** | |
| **Test Case ID:** TC_BLE_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Persistent Keepalive | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Persistent GATT Background Auto-Reconnection & Keepalive | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies background keepalive worker automatically re-establishes BLE GATT connection if wearable goes out of range and returns. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Toggle BLE Auto-Reconnect Keepalive switch | Element ID: toggle_ble_keepalive | Auto-reconnect service active in background with exponential backoff listener | Keepalive worker enabled and monitoring peripheral state | **Pass** |

---

### Test Case 39

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Vitals Telemetry Test Case** | |
| **Test Case ID:** TC_BLE_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Heart Rate 0x180D | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify Standard Bluetooth SIG 0x180D Heart Rate Telemetry Ingestion | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies parsing of standard 0x2A37 Heart Rate Measurement notifications and updating live BPM sparkline chart. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Inspect live Heart Rate telemetry stream card | Element ID: ble_telemetry_hr_stream | Live BPM updates continuously from peripheral characteristic notifications | Heart rate telemetry displayed (e.g. 74 BPM) with real-time waveform | **Pass** |

---

### Test Case 40

| **Project Name: FemSphere** | |
| :--- | :--- |
| **Device Telemetry Test Case** | |
| **Test Case ID:** TC_BLE_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority (Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Battery Level 0x180F | **Test Executed By:** Amal K Jose |
| **Test Title:** Verify 0x180F Battery Level Characteristic Polling & Display | **Test Execution Date:** 2026-10-16 |
| **Description:** Verifies reading 0x2A19 Battery Level percentage characteristic and rendering battery gauge icon in dashboard header. | |

| Step | Test Step | Test Data | Expected Result | Actual Result | Status (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Inspect battery indicator on connected wearable tile | Element ID: ble_device_battery_level | Battery percentage displays current charge level (e.g. 85%) | Battery level rendered accurately (85% Charge) | **Pass** |

---

