# FemSphere – Comprehensive Automated & Manual Test Cases Verification Report

**Project Name:** FemSphere – Lifetime AI Health Twin Companion Platform  
**Test Designed By:** KEERTHANA M (Lead QA Automation Engineer)  
**Test Executed By:** Amal K Jose  
**Test Execution Date:** October 16, 2026  
**Total Executed Test Cases:** 40 | **Passed:** 40 (100.0%) | **Failed:** 0  

---

## Test Case 1

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Patient Authentication Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Patient Authentication | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Valid Patient Login & Dashboard Redirection | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that a registered female patient can successfully authenticate with valid credentials, receive a secure JWT token, and transition to the Patient Health Dashboard.  
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
### Patient Authentication Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Patient Authentication | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Invalid Credentials Rejected with Secure Alert | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that submitting unregistered email or wrong password rejects authentication with HTTP 401 and displays an accessible security warning snackbar.  
**Pre-Condition :** Application is running on the Login screen with network connectivity.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate Email and Password input fields on Sign In screen | IDs: login_email_input, login_password_input | Both input fields are visible and cleared of previous input | Inputs ready for testing | **Pass** |
| 2 | Enter incorrect user email address | Email: invalid_user@femsphere.health | Text entered into email input field | Invalid email string typed | **Pass** |
| 3 | Enter non-matching password string | Password: WrongPassword2026# | Password masked and accepted by text controller | Masked characters entered | **Pass** |
| 4 | Click Login button to initiate request | Element ID: login_submit_button | Request payload sent to POST /api/auth/login | HTTP 401 Unauthorized returned by Express backend | **Pass** |
| 5 | Verify visual error feedback snackbar | Message: 'Invalid email or password' | Red/Amber warning banner displayed; user remains on Login view | Error banner shown; no unauthorized session initialized | **Pass** |

**Post-Condition:** No authorization token is issued or stored in persistent storage.

---

## Test Case 3

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Superuser Authentication Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Multi-Role Portal Access | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Administrator Superuser Portal Authentication | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that an administrative user authenticating with admin credentials routes directly to the FemSphere Admin Management Console.  
**Pre-Condition :** Admin user credentials exist in users table with role='admin'.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Enter admin superuser email address | Email: admin@femsphere.health | Admin email formatted and accepted | Email field populated | **Pass** |
| 2 | Enter admin secret credentials | Password: AdminSecure2026! | Credentials entered securely | Password entered into masked field | **Pass** |
| 3 | Tap Login button | Element ID: login_submit_button | Backend validates role='admin' in JWT claim | HTTP 200 OK with admin role payload | **Pass** |
| 4 | Verify routing to Admin Console | Route: /admin/dashboard | System loads Admin Portal showing user directories and audit stats | Admin dashboard loaded with administrative metrics | **Pass** |

**Post-Condition:** Admin privileges granted with full system monitoring capability.

---

## Test Case 4

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Doctor Clinical Authentication Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Clinical Access Portal | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Doctor Clinical Portal Login & Schedule Access | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that a licensed doctor authenticates into the Clinical Practice view and views assigned patient consultation schedules.  
**Pre-Condition :** Doctor record active with role='doctor' and specialty='Obstetrics/Gynecology'.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Enter clinician email on login screen | Email: dr.jenkins@femsphere.health | Doctor email populated accurately | Doctor email typed | **Pass** |
| 2 | Enter clinical staff password | Password: ClinicalPassword2026# | Password masked and accepted | Password entered | **Pass** |
| 3 | Tap Login submit button | Element ID: login_submit_button | API validates doctor role and responds with clinical token | HTTP 200 OK received with clinical credentials | **Pass** |
| 4 | Verify Doctor Dashboard consultation roster | Component: DoctorScheduleCard | Clinical dashboard renders patient queue and today's appointments | Doctor view rendered showing 4 scheduled teleconsultations | **Pass** |

**Post-Condition:** Doctor session initialized with HIPAA-compliant clinical record access.

---

## Test Case 5

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Caregiver Authentication Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Portal Access | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Caregiver Multi-Dependent Portal Authentication | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that an authorized caregiver logs in and accesses dependent profiles (elderly mother and newborn infant).  
**Pre-Condition :** Caregiver account active with role='caregiver' and dependent relationships linked.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Enter caregiver email address | Email: caregiver@femsphere.health | Caregiver email entered into login form | Email populated | **Pass** |
| 2 | Enter secure caregiver password | Password: CaregiverPass123! | Password entered in masked format | Password entered | **Pass** |
| 3 | Submit login form | Element ID: login_submit_button | Server returns caregiver token and dependent association IDs | HTTP 200 OK returned with 2 linked dependent profiles | **Pass** |
| 4 | Verify Caregiver Dashboard displays dependents selector | Dropdown: switch_dependent_dropdown | Dashboard opens displaying dependent switcher and vitals tracker | Caregiver vault loaded with dependent management widgets | **Pass** |

**Post-Condition:** Caregiver access authorized for proxy health monitoring.

---

## Test Case 6

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Network & Loopback Connectivity Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Network Infrastructure | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify ADB Reverse Socket Connectivity on Port 5001 | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that ADB reverse socket bridge connects local emulator or Android device to the FemSphere backend on 127.0.0.1:5001.  
**Pre-Condition :** ADB daemon is running and reverse proxy rule 'adb reverse tcp:5001 tcp:5001' is applied.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Initialize TCP socket connection to loopback address | Host: 127.0.0.1, Port: 5001 | TCP socket initiates handshake without immediate connection refusal | Socket opened cleanly | **Pass** |
| 2 | Set socket timeout limit | Timeout: 2000ms | Timeout configured for network safety | Timeout applied | **Pass** |
| 3 | Execute connect_ex probe on port 5001 | Command: sock.connect_ex(('127.0.0.1', 5001)) | Returns 0 (active listener) or recognized socket code | Result code 0 received; port 5001 actively responding | **Pass** |
| 4 | Close test socket | sock.close() | Socket released without resource leaks | Socket closed gracefully | **Pass** |

**Post-Condition:** Device-to-host ADB reverse network pathway verified operational.

---

## Test Case 7

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Logout & Session Security Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_AUTH_07 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Session Security | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Logout Token Clearance & Session Invalidation | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that tapping Sign Out clears secure storage tokens, invalidates session state, and redirects user to Login screen.  
**Pre-Condition :** User is currently authenticated in an active session.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Navigate to User Profile / Settings tab | Bottom Nav: Profile Tab | Profile view opens with account preferences and signout button | Profile settings loaded | **Pass** |
| 2 | Locate and click 'Sign Out' button | Element ID: profile_logout_button | Confirmation prompt appears or logout routine initiates immediately | Sign out action triggered | **Pass** |
| 3 | Verify local secure storage token purging | Storage Keys: jwt_token, user_session | Auth token evicted from FlutterSecureStorage and memory cache | Tokens purged completely from storage | **Pass** |
| 4 | Verify redirect to Login screen | View: SignInScreen | Application lands on unauthenticated Sign In screen | Sign In screen displayed; backward navigation blocked | **Pass** |

**Post-Condition:** Application state is unauthenticated; unauthorized requests are rejected.

---

## Test Case 8

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Consultations Directory Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Telehealth Consultations | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Clinical Doctor Consultations Directory Rendering | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that navigating to the Consultations module fetches licensed specialists from backend and displays clinical cards.  
**Pre-Condition :** User logged into Patient Dashboard; doctor records seeded in database.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Tap on Consultations navigation tab | Accessibility ID: tab_consultations | Consultations directory opens with title 'Clinical Specialists' | Consultations tab active; specialist directory loaded | **Pass** |
| 2 | Verify doctor card information elements | Doctor: Dr. Sarah Jenkins (OB/GYN) | Card shows doctor name, photo avatar, specialty badge, and ratings | Specialist cards displayed with specialty badges and fee structure | **Pass** |
| 3 | Inspect filter chips for medical specialties | Filters: Gynecology, Fertility, Endocrinology | Chips allow filtering doctor list by specialty | Specialty filter chips responsive and active | **Pass** |

**Post-Condition:** Consultations directory populated with verified clinical specialists.

---

## Test Case 9

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Appointment Booking Modal Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Telehealth Consultations | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Appointment Booking Modal Trigger on Tap | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that clicking 'Book Consultation' on a doctor card opens the appointment configuration modal sheet without errors.  
**Pre-Condition :** Doctor card visible on the Consultations screen.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate 'Book Consultation' action button on doctor card | Element ID: btn_book_appointment | Action button is visible, clickable, and styled with primary theme | Button located and highlighted | **Pass** |
| 2 | Tap 'Book Consultation' button | Event: OnTap | Slide-up modal dialog opens displaying booking form controls | Booking bottom sheet opened smoothly | **Pass** |
| 3 | Verify presence of doctor summary header in modal | Doctor Name: Dr. Sarah Jenkins | Modal displays doctor name, consultation rate, and specialty icon | Summary header displayed in modal | **Pass** |

**Post-Condition:** Appointment booking modal is open and ready for slot selection.

---

## Test Case 10

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Doctor Selector UI Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Telehealth Consultations | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Doctor Dropdown Selector Rendering Without Overflow | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that expanding the clinician dropdown selector inside the booking form renders without yellow/black layout overflow bars.  
**Pre-Condition :** Booking modal is displayed on screen.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate clinician selector dropdown | Element ID: doctor_dropdown_selector | Dropdown is visible with current doctor pre-selected | Dropdown displayed | **Pass** |
| 2 | Tap dropdown to expand list of available physicians | Event: Dropdown Expansion | Menu unfolds showing list of all verified doctors | Menu expanded cleanly with 5 physician choices | **Pass** |
| 3 | Inspect screen boundaries for Flutter layout overflow warnings | Criteria: 0 A RenderFlex overflowed errors | List items fit within screen width; text wraps cleanly | Zero overflow bars detected; layout constraints respected | **Pass** |

**Post-Condition:** Physician dropdown functions without layout constraint errors.

---

## Test Case 11

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Consultation Type Toggle Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Telehealth Consultations | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Consultation Type Toggle (Virtual Telehealth vs In-Clinic) | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies toggling consultation mode between HD Video Telehealth and In-Clinic visit updates appointment payload metadata.  
**Pre-Condition :** Booking modal open with consultation type segmented control.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate appointment type segmented switch | Element ID: appointment_type_toggle | Options 'Virtual Telehealth' and 'In-Clinic' displayed | Segmented switch visible; 'Virtual' active by default | **Pass** |
| 2 | Tap 'In-Clinic' segment button | Selection: In-Clinic | Switch animates to In-Clinic; clinic physical address renders below | Toggled to In-Clinic; clinic address displayed | **Pass** |
| 3 | Tap 'Virtual Telehealth' segment button | Selection: Virtual Telehealth | Switch animates back; video consultation icon and instructions show | Toggled back to Virtual Telehealth; meeting link note shown | **Pass** |

**Post-Condition:** Selected consultation type is saved in component state.

---

## Test Case 12

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Time Slot Selection Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Telehealth Consultations | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Time Slot Selection & Real-Time Availability | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies selecting an appointment time slot highlights the selected pill and disables booked/unavailable slots.  
**Pre-Condition :** Date selected in calendar picker with open slots.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | View available time slot pills for selected consultation date | Slots: 09:00 AM, 10:00 AM, 11:30 AM, 02:00 PM, 04:30 PM | Slots render horizontally in scrollable grid | Slot chips rendered with active and inactive styles | **Pass** |
| 2 | Click on '10:00 AM' slot pill | Element ID: slot_10_00_am | Slot chip highlights in primary brand color; checkmark displays | 10:00 AM slot highlighted and selected | **Pass** |
| 3 | Verify appointment summary details update in real-time | Summary Card: Date + Time | Summary bar updates to reflect 'Selected: 10:00 AM' | Summary updated with exact time slot | **Pass** |

**Post-Condition:** Time slot locked in state for confirmation submission.

---

## Test Case 13

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Appointment Confirmation Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_APP_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Telehealth Consultations | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Appointment Reservation Submission to Express API | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies submitting appointment reservation sends POST /api/appointments payload and receives confirmation ID with calendar invite.  
**Pre-Condition :** Doctor, type, date, and slot configured in booking form.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Verify all appointment form criteria in summary card | Doctor: Dr. Sarah Jenkins; Slot: 10:00 AM; Type: Virtual | Summary card accurately reflects choices | Summary card verified | **Pass** |
| 2 | Click 'Confirm Booking' submission button | Element ID: btn_confirm_booking | Loading spinner displays on button while dispatching request | Loading spinner shown; request dispatched | **Pass** |
| 3 | Monitor network payload for POST /api/appointments | Payload: { doctor_id: 1, date: '2026-10-28', slot: '10:00 AM' } | HTTP 201 Created returned with appointment confirmation ID | HTTP 201 Created received with ID #1042 | **Pass** |
| 4 | Verify Booking Confirmed success modal displays | Modal: Booking Success Dialog | Dialog appears with teleconsultation link and calendar button | Success dialog rendered with appointment summary | **Pass** |
| 5 | Confirm appointment appears under Upcoming Consultations | List: Upcoming Appointments | Appointment visible in patient queue with 'Confirmed' badge | Appointment visible in directory with green status badge | **Pass** |

**Post-Condition:** Appointment record persisted in PostgreSQL and calendar event created.

---

## Test Case 14

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Wearables Pairing Hub Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Opening Universal Wearable Pairing Interface | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies navigating to Devices tab opens the Universal Wearables Pairing Hub with camera QR scanner and brand adapters.  
**Pre-Condition :** User logged into FemSphere on Android device.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Navigate to Connected Devices view via bottom navigation | Bottom Nav: Devices Tab | Connected Devices view displays paired devices and pairing CTA | Devices view rendered with 'Connect New Device' button | **Pass** |
| 2 | Tap on 'Connect New Wearable' button | Element ID: btn_open_wearables_scanner | Pairing hub launches with QR scanning viewport and brand filters | Pairing hub opened cleanly | **Pass** |
| 3 | Verify device category tabs render horizontally | Categories: Smartwatches, Fitness Bands, Smart Rings | Filter pills render horizontally without clipping | Category pills displayed with active filter styling | **Pass** |

**Post-Condition:** Wearables pairing interface initialized and ready for scanning.

---

## Test Case 15

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### GPay-Style QR Scanner Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Live Viewfinder Camera Feed for QR Pairing | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies live camera preview initializes inside a Google Pay-style rounded scanning box with animated corner guides.  
**Pre-Condition :** Camera permission granted to application.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Inspect live viewfinder element presence | Element ID: qr_scanner_viewfinder | Camera viewport container renders with 1:1 square aspect ratio | Viewfinder container located and sized correctly | **Pass** |
| 2 | Verify camera hardware initializes without freeze | Hardware: Android Camera2 API | Live camera stream frames render continuously inside overlay | Live preview feed active without dropped frames | **Pass** |
| 3 | Verify animated scanning guideline bar | Overlay: Scanning Line Animation | Subtle pulse animation indicates active QR detection | Animated laser guideline cycles smoothly inside frame | **Pass** |

**Post-Condition:** Camera stream active and analyzing frames for wearable pairing codes.

---

## Test Case 16

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Audio Wearables Filter Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Low | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Smart Audio & Hearing Device Filter Chip | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies selecting 'Earbuds & Audio' filters out non-audio smartwatches and focuses on hearing health / noise exposure telemetry.  
**Pre-Condition :** Pairing hub open on device category selector.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate 'Audio / Earbuds' category chip | Element ID: chip_filter_earbuds | Chip is visible with headphone icon | Earbuds chip located | **Pass** |
| 2 | Tap on 'Audio / Earbuds' filter chip | Event: OnTap | Device list filters to show audio devices (Noise Buds, etc.) | Filtered to audio devices; smartwatches excluded from view | **Pass** |
| 3 | Verify audio decibel monitoring badge | Capability: Environmental Decibel Telemetry | Audio capability badge displayed on device card | Decibel monitoring badge verified | **Pass** |

**Post-Condition:** Audio filter active in pairing interface.

---

## Test Case 17

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Direct Bluetooth Discovery Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Direct Bluetooth Low Energy Peripheral Scan Navigation | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies tapping 'Scan Bluetooth Directly' launches BLE discovery scan for nearby un-paired smartwatches and health rings.  
**Pre-Condition :** Bluetooth adapter is enabled on device.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate 'Scan via Bluetooth' alternate action button | Element ID: btn_scan_bluetooth | Button displayed below QR viewfinder frame | BLE scan button located | **Pass** |
| 2 | Tap 'Scan via Bluetooth' button | Event: Start BLE Discovery | BLE discovery starts; scanning progress indicator animates | Bluetooth Low Energy scan initiated cleanly | **Pass** |
| 3 | Verify discovered peripheral list view renders | Component: DiscoveredDevicesList | Discovered peripherals display with RSSI signal and MAC address | Nearby BLE devices displayed with signal indicators | **Pass** |

**Post-Condition:** Bluetooth discovery active and listening for advertisement packets.

---

## Test Case 18

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### boAt Wearable Adapter Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify boAt Wave Beat Telemetry Pairing Handshake | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies pairing with a boAt Wave Beat smartwatch establishes BLE GATT communication for heart rate and step telemetry.  
**Pre-Condition :** boAt device card visible in pairing hub.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Select boAt Wave Beat from device list | Element ID: device_boat_wave_beat | Selection triggers connection adapter for boAt BLE profile | boAt adapter initialized | **Pass** |
| 2 | Initiate pairing handshake | Adapter: BoatBleAdapter | GATT services discovered (HR 0x180D, Battery 0x180F) | GATT services discovered and registered | **Pass** |
| 3 | Verify device status updates to 'Connected' | Status Badge: Connected | Device listed under Active Wearables with green status badge | Device shows 'Connected' with live battery level indicator | **Pass** |

**Post-Condition:** boAt smartwatch active and transmitting telemetry to FemSphere.

---

## Test Case 19

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Amazfit & Health Connect Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Amazfit Bip U Pro & Android Health Connect Pairing | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that Amazfit Bip U Pro routes health data through Zepp and Android Health Connect with automatic fallback from raw BLE.  
**Pre-Condition :** Zepp app installed and Health Connect permissions granted.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Select Amazfit Bip U Pro from wearable directory | Element ID: device_amazfit_bip_u_pro | System identifies Amazfit device and launches Health Connect flow | Amazfit profile recognized; Health Connect pipeline chosen | **Pass** |
| 2 | Verify Health Connect integration dialog | Modal: Amazfit Health Connect Setup Guide | Guide explains Zepp sync mechanism and prompts permission grant | Setup guide displayed with 3-step synchronization steps | **Pass** |
| 3 | Trigger 'Sync Health Connect' authorization | Permissions: Steps, Heart Rate, Sleep, Calories | Native Android Health Connect permission sheet prompts user | Permission launcher opens; user grants read access | **Pass** |
| 4 | Verify biometrics received from Health Connect | Attribution: com.huami.midong (Zepp) | Steps and heart rate records retrieved and displayed on dashboard | Authorized records ingested and displayed with 'Cloud Synced' badge | **Pass** |

**Post-Condition:** Amazfit health records successfully ingested via Health Connect.

---

## Test Case 20

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Camera Torch Toggle Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_WEAR_07 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Low | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Universal Wearables Hub | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Flashlight Torch Toggle Controller for Low-Light Scanning | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies toggling camera flashlight button enables and disables the physical LED torch during low-light QR scanning operations.  
**Pre-Condition :** Camera viewfinder active with torch capability available.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate torch toggle icon button | Element ID: btn_toggle_torch | Torch button is visible in top right corner of camera view | Torch button located with off-state icon | **Pass** |
| 2 | Tap torch button to turn LED flashlight ON | Event: TorchMode.on | Device LED illuminates; button icon switches to active state | Camera torch enabled; button highlighted in yellow | **Pass** |
| 3 | Tap torch button again to turn LED flashlight OFF | Event: TorchMode.off | Device LED turns off; button icon returns to default state | Camera torch disabled cleanly | **Pass** |

**Post-Condition:** Torch state restored to OFF.

---

## Test Case 21

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Aggregate Health Score Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Digital Health Twin | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Aggregate Health Score Dial & Biological Age Rendering | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that the Digital Health Twin calculates and displays the composite wellness score and biological age discrepancy.  
**Pre-Condition :** User logged into Patient Dashboard with vitals recorded.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate Digital Health Twin summary card on home dashboard | Element ID: health_score_card | Card renders animated circular score dial (0 to 100) | Card visible with circular progress indicator | **Pass** |
| 2 | Verify composite health score calculation | Calculated Score: 88/100 (Optimal) | Score reflects weighted average of sleep, hydration, and activity | Score 88 displayed with 'Optimal' green wellness indicator | **Pass** |
| 3 | Verify biological age comparison metric | Chronological: 28 yrs, Biological Twin: 26.4 yrs | Displays '1.6 years younger than chronological age' | Biological age bonus badge rendered correctly | **Pass** |

**Post-Condition:** Health twin composite score accurately rendered on dashboard.

---

## Test Case 22

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Hydration Logging Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Daily Vitals Tracker | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Daily Water Intake Counter Increment & Target Progress | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies tapping the water increment button adds 250ml to daily hydration log and updates circular completion ring.  
**Pre-Condition :** Vitals Tracker tab open with today's hydration card.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Inspect initial water intake value | Initial: 1.50 L / 2.50 L Goal (60%) | Initial value displayed with current progress bar | Current intake 1.50 L displayed | **Pass** |
| 2 | Tap '+250ml' hydration increment button | Element ID: btn_increment_water | Value increases by 0.25 L to 1.75 L (70%) | Value updated to 1.75 L with water ripple animation | **Pass** |
| 3 | Verify progress bar updates dynamically | Progress Ring: 70% | Progress indicator expands proportionally | Ring filled to 70% of daily target | **Pass** |

**Post-Condition:** Hydration intake persisted in local state.

---

## Test Case 23

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Sleep Biometrics Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Daily Vitals Tracker | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Sleep Duration Numeric Input & Sleep Quality Analysis | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies entering sleep duration accepts decimal values and calculates restorative sleep quality metrics.  
**Pre-Condition :** Sleep tracking card open on vitals logger.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate sleep duration input field | Element ID: input_sleep_duration | Field is interactive and accepts numeric input with decimals | Field ready for input | **Pass** |
| 2 | Type sleep hours into field | Input: '7.5' | Value '7.5 hrs' formatted and validated | Value entered and formatted | **Pass** |
| 3 | Verify sleep quality rating card | Threshold: 7-9 hours | Card displays 'Restorative Sleep Target Achieved' | Quality badge shows 'Good (7.5 hrs)' with sleep icon | **Pass** |

**Post-Condition:** Sleep record staged for daily log submission.

---

## Test Case 24

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Psychosomatic Mood Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Low | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Daily Vitals Tracker | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Mood and Energy Selector Pills Validation | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies selecting emotional and energy states updates daily psychosomatic wellness profile.  
**Pre-Condition :** Mood selector section open in vitals logging form.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Inspect mood selection chips | Chips: Calm, Energetic, Anxious, Fatigued, Irritable | Chips display with matching emoji icons | Mood chips visible and selectable | **Pass** |
| 2 | Click on 'Calm' mood chip | Element ID: chip_mood_calm | Chip highlights with lavender theme; other chips deselect | 'Calm' selected with checkmark | **Pass** |
| 3 | Verify energy rating selector | Energy Level: High (4/5) | Energy stars or level updates to match selection | Energy rating set to 4/5 | **Pass** |

**Post-Condition:** Mood and energy recorded for psychosomatic health twin modeling.

---

## Test Case 25

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Pelvic Pain Scale Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Daily Vitals Tracker | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify VAS Pelvic Pain and Dysmenorrhea Scale Slider | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies adjusting the Visual Analog Scale (VAS) pain slider reflects numerical score (0-10) and clinical severity classification.  
**Pre-Condition :** Pain tracking section visible in vitals tracker.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate Visual Analog Scale (VAS) slider | Element ID: slider_pelvic_pain | Slider range 0 (No pain) to 10 (Severe pain) is visible | Slider located with initial value 0 | **Pass** |
| 2 | Slide slider control to value 3 | Value: 3.0 | Slider handle moves to 3; text displays 'Mild Cramping (3/10)' | Pain rating 3/10 displayed with green/yellow indicator | **Pass** |
| 3 | Slide slider control to value 8 | Value: 8.0 | Slider handle moves to 8; text displays 'Severe Pain (8/10)' | Pain rating 8/10 displayed with red indicator and clinical advisory | **Pass** |

**Post-Condition:** Pain score recorded with clinical severity flag.

---

## Test Case 26

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Cycle Phase Prediction Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_06 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Cycle Intelligence | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Menstrual Cycle Phase Prediction & 28-Day Baseline Calibration | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that the Digital Health Twin calculates current menstrual cycle day, predicts upcoming fertile window and period onset, and displays phase recommendations.  
**Pre-Condition :** User has recorded last menstrual period start date 14 days prior.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Navigate to Period Tracker & Cycle Intelligence module | Bottom Nav: Cycle Tab | Cycle tracker dashboard displays circular phase gauge and calendar | Cycle dashboard rendered with current day indicator | **Pass** |
| 2 | Verify current cycle day calculation from last period onset | Last Period: 14 days ago | System computes Cycle Day 14 (Ovulatory Phase window) | Cycle Day 14 displayed with 'High Fertility' indicator | **Pass** |
| 3 | Inspect next period start date prediction | Baseline: 28 days cycle | System predicts period onset in 14 days based on historical average | Next period countdown displayed: '14 days remaining' | **Pass** |
| 4 | Verify hormonal phase lifestyle and nutrition advice card | Phase: Ovulation Phase | Informational card recommends hydration, antioxidant nutrition, and light exercise | Nutrition and wellness recommendation cards loaded for Ovulatory phase | **Pass** |
| 5 | Confirm cycle calendar displays projected fertile days | Calendar View: Current Month | Fertile days highlighted with distinctive purple gradient markers | Calendar displays 5-day fertile window with correct visual badges | **Pass** |

**Post-Condition:** Cycle stage synchronized across mobile dashboard and twin model.

---

## Test Case 27

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Cloud Sync Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_TWIN_07 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Daily Vitals Tracker | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Daily Vitals Log Persistence & PostgreSQL Cloud Sync | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies tapping 'Save Daily Log' commits all entered biometrics to PostgreSQL backend and updates audit sync timestamp.  
**Pre-Condition :** Vitals inputs (water, sleep, mood, pain) populated in tracker form.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate 'Save Daily Log' submission button | Element ID: btn_save_daily_vitals | Button active and highlighted in primary theme | Button located | **Pass** |
| 2 | Click 'Save Daily Log' button | Event: OnTap | Form validates and dispatches POST /api/period-tracker/daily-log | HTTP 200 OK received from backend API | **Pass** |
| 3 | Verify PostgreSQL record insertion | Table: health_tracker, user_id: current | Record upserted with current log_date and metric values | Database verified; row committed with UTC timestamp | **Pass** |
| 4 | Verify success toast notification on screen | Toast: 'Daily log synced successfully' | Green confirmation toast displays; dashboard metrics refresh | Confirmation toast displayed; dashboard metrics updated | **Pass** |

**Post-Condition:** Vitals saved to database and reflected in Digital Health Twin state.

---

## Test Case 28

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Caregiver Overview Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_CG_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Multi-Dependent Summary Card & Critical Alerts Display | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies caregiver dashboard renders multi-dependent status cards, vital sign summaries, and pending medication alerts.  
**Pre-Condition :** Caregiver logged in with linked dependent profiles.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Navigate to Caregiver Dashboard tab | Route: /caregiver/dashboard | Caregiver Portal opens showing active dependents header | Caregiver view loaded cleanly | **Pass** |
| 2 | Inspect dependent overview cards | Element ID: caregiver_overview_card | Cards display names, ages, health twins, and recent vitals | Dependent cards rendered for 'Sophia (Mother)' and 'Maya (Infant)' | **Pass** |
| 3 | Verify urgent health alerts section | Alerts: Missed Medication Flag | Urgent notifications rendered at top of caregiver view | Reminder card displayed: 'Blood pressure check scheduled at 2:00 PM' | **Pass** |

**Post-Condition:** Dependent health summary accurately displayed for caregiver.

---

## Test Case 29

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Dependent Profile Switcher Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_CG_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Switching Active Dependent Profile Between Ward and Parent | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies switching between dependent profiles updates dashboard vitals, medications, and immunization schedules accordingly.  
**Pre-Condition :** Multiple dependents configured under caregiver account.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate dependent profile dropdown switcher | Element ID: switch_dependent_dropdown | Switcher shows currently active dependent | Dropdown displays 'Sophia Rostova (Mother, Age 68)' | **Pass** |
| 2 | Tap dropdown and select secondary dependent | Selection: 'Maya Rostova (Infant, 8 Months)' | Caregiver dashboard switches focus to infant profile | Active profile switched to Maya Rostova | **Pass** |
| 3 | Verify view updates with infant-specific trackers | Modules: Pediatric Vaccines, Feeding & Growth Log | Dashboard reloads showing pediatric charts and vaccine cards | Pediatric health metrics and immunization roadmap rendered | **Pass** |

**Post-Condition:** Active dependent context switched to infant profile.

---

## Test Case 30

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Medication Reminder Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_CG_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Prescription Medication Dosage Reminder Creation | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies adding a prescription dosage reminder creates a scheduled notification and persists record to database.  
**Pre-Condition :** Caregiver has active dependent selected.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate and click 'Add Medication Reminder' button | Element ID: btn_add_medication | Medication reminder creation form modal opens | Add medication dialog displayed | **Pass** |
| 2 | Enter medication name and dosage specifications | Drug: 'Metformin 500mg', Frequency: 'Twice daily' | Form validates input and prompts for reminder time | Medication details accepted | **Pass** |
| 3 | Set reminder alert time | Time: 08:00 AM & 08:00 PM | Time picker records reminder schedules | Reminder times configured | **Pass** |
| 4 | Tap Save Reminder button | Action: Save Prescription | Reminder saved to backend and scheduled with local alarms | HTTP 201 Created received; reminder appears on medication roster | **Pass** |

**Post-Condition:** Medication reminder active and alert scheduled in local notification engine.

---

## Test Case 31

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Vaccination Tracker Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_CG_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Caregiver Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Dependent Vaccination Schedule & Timeline Tracker | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies accessing the pediatric vaccination schedule displays WHO-recommended immunization milestones with completion badges.  
**Pre-Condition :** Infant dependent profile selected in caregiver dashboard.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Tap on 'Vaccinations' navigation tab | Element ID: tab_vaccinations | Vaccination schedule timeline view opens | Vaccination screen displayed | **Pass** |
| 2 | Inspect completed vaccines list | Vaccines: BCG, HepB Dose 1, Polio OPV-1 | Completed immunizations show green checkmarks and administration dates | Completed vaccines rendered with batch numbers and date stamps | **Pass** |
| 3 | Inspect upcoming scheduled vaccines | Upcoming: Measles-Rubella (MR Dose 1 - Age 9 Months) | Upcoming milestone displays countdown alert and booking CTA | Next vaccine alert displayed: 'Due in 3 weeks' | **Pass** |

**Post-Condition:** Immunization records verified and tracked against clinical guidelines.

---

## Test Case 32

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Medical Records Vault Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_REC_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Clinical Records Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Patient Medical Records Vault Directory Access | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies opening the Medical Vault displays categorized diagnostic lab reports, ultrasound scans, and prescriptions with HIPAA encryption.  
**Pre-Condition :** User logged in with medical records seeded in vault.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Tap on Medical Records tab in bottom navigation | Element ID: tab_medical_records | Medical Records Vault view opens with search bar and categories | Vault opened cleanly with encrypted storage banner | **Pass** |
| 2 | Verify categorized document folders | Folders: Lab Reports, Ultrasounds, Prescriptions | Folder tiles display document count badges | Folders rendered with document counts | **Pass** |
| 3 | Inspect recent documents table | Recent: 'Complete Blood Count (CBC) - 2026-10-10.pdf' | Document card displays filename, upload date, and OCR status | CBC lab report displayed with 'OCR Processed' badge | **Pass** |

**Post-Condition:** Medical Vault accessible and documents decrypted for authenticated patient.

---

## Test Case 33

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Document Upload Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_REC_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Clinical Records Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Diagnostic Lab Report Upload Modal & PDF Attachment | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies clicking 'Upload Record' opens file picker modal, validates PDF format, and stages document for AI OCR parsing.  
**Pre-Condition :** Medical Vault open on screen.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Click on 'Upload Medical Record' FAB button | Element ID: btn_upload_medical_record | Upload bottom sheet opens with Drag & Drop and Browse options | Upload sheet modal opened | **Pass** |
| 2 | Select diagnostic lab PDF file from storage | File: Lipid_Panel_Diagnostic_Report.pdf (2.4 MB) | File validated for MIME type (application/pdf) and size (< 15MB) | File accepted; preview thumbnail and file size displayed | **Pass** |
| 3 | Fill record metadata fields | Category: 'Blood Test', Provider: 'Quest Diagnostics' | Fields accepted and validated | Metadata populated cleanly | **Pass** |

**Post-Condition:** File staged and ready for Gemini OCR extraction.

---

## Test Case 34

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Gemini AI OCR Engine Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_REC_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Clinical Records Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Gemini 2.5 Flash OCR Biomarker Table Rendering | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that the Gemini AI OCR engine parses diagnostic lab PDF, extracts biomarker key-values, and renders structured results table.  
**Pre-Condition :** Lab report uploaded with OCR processing completed.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Open details for processed lab report | Document: 'CBC_Metabolic_Panel.pdf' | Report details screen opens with tabs: 'Original File' & 'AI Insights' | Report details loaded with OCR results view | **Pass** |
| 2 | Inspect AI Biomarkers Extraction table | Element ID: biomarker_results_table | Table renders columns: Biomarker Name, Value, Reference Range, Status | Biomarker table visible with parsed laboratory readings | **Pass** |
| 3 | Verify extracted hemoglobin reading and reference status | Hemoglobin: 13.8 g/dL (Range: 12.0 - 15.5 g/dL) | Hemoglobin classified as 'Normal' with green badge | Reading parsed accurately as 13.8 g/dL with green Normal badge | **Pass** |
| 4 | Verify extracted ferritin reading and reference status | Serum Ferritin: 18 ng/mL (Range: 15 - 150 ng/mL) | Ferritin flagged as 'Low-Normal' with nutritional iron recommendation | Low-normal iron alert rendered with twin diet recommendation | **Pass** |

**Post-Condition:** Biomarkers parsed and mapped into Digital Twin metabolic profile.

---

## Test Case 35

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Diagnostic Document Viewer Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_REC_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** Clinical Records Vault | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Secure Diagnostic File Download & In-App Document Viewer | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies tapping 'View Original Report' retrieves encrypted file from secure cloud and renders in native in-app PDF viewer.  
**Pre-Condition :** Lab report selected in medical records vault.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate 'View Original PDF' action button | Element ID: btn_view_report_file | Action button is visible with document eye icon | Button located | **Pass** |
| 2 | Click 'View Original PDF' button | Event: Open Document Viewer | Encrypted file downloaded and rendered inside native PDF canvas | In-app PDF viewer launched displaying high-resolution pages | **Pass** |
| 3 | Test page zoom and scrolling navigation | Gesture: Pinch-to-zoom & Vertical Scroll | Document zooms smoothly without raster distortion or crash | PDF navigation smooth and responsive | **Pass** |

**Post-Condition:** Original diagnostic document rendered securely inside protected sandbox.

---

## Test Case 36

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### GATT Service Discovery Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_BLE_01 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE GATT Engine | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Standalone BLE GATT Service Discovery on Peripheral Manager | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that connecting to a Bluetooth Smartwatch triggers primary GATT service discovery and catalogs Heart Rate, Battery, and Device Info services.  
**Pre-Condition :** BLE peripheral connected via FlutterBluePlus adapter.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Initiate GATT service discovery on connected peripheral | Method: peripheral.discoverServices() | Service discovery completes with status GATT_SUCCESS (0) | GATT_SUCCESS returned; 11 services cataloged | **Pass** |
| 2 | Verify presence of Standard Heart Rate Service | Service UUID: 0x180D (0000180d-0000-1000-8000-00805f9b34fb) | Heart Rate service located in peripheral GATT tree | 0x180D service identified and registered | **Pass** |
| 3 | Verify presence of Standard Battery Service | Service UUID: 0x180F (0000180f-0000-1000-8000-00805f9b34fb) | Battery service located in peripheral GATT tree | 0x180F service identified and registered | **Pass** |

**Post-Condition:** GATT service tree cataloged and characteristics prepared for subscription.

---

## Test Case 37

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Standalone Telemetry Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_BLE_02 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Medium | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE GATT Engine | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Biometric Telemetry Operates Without Vendor Cloud Apps | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies standard BLE smartwatches stream biometrics directly into FemSphere without requiring proprietary vendor OEM applications.  
**Pre-Condition :** Vendor companion apps uninstalled or disabled in background.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Verify standalone BLE badge is rendered on devices screen | Element ID: badge_standalone_ble | Badge reads 'Direct BLE Mode (No Vendor Cloud Required)' | Standalone badge visible with Bluetooth icon | **Pass** |
| 2 | Subscribe to Heart Rate measurement notification characteristic | Characteristic: 0x2A37 (Heart Rate Measurement) | Client Characteristic Configuration Descriptor (CCCD 0x2902) set to notify | Notification enabled; GATT status 0 received | **Pass** |
| 3 | Verify direct packet decoding into live BPM reading | Payload: [0x00, 0x48] -> 72 BPM | Raw byte packet unpacked into integer BPM without cloud processing | 72 BPM decoded and displayed directly on health dashboard | **Pass** |

**Post-Condition:** Direct on-device telemetry stream active without external cloud dependencies.

---

## Test Case 38

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Auto-Reconnect Keepalive Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_BLE_03 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE GATT Engine | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Persistent Auto-Reconnect Keepalive Listener | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies that walking out of Bluetooth range and returning triggers automatic background reconnection without user intervention.  
**Pre-Condition :** Wearable paired with auto-reconnect setting enabled.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Verify auto-reconnect toggle is enabled in device settings | Element ID: toggle_ble_keepalive | Toggle switch active; background listener registered | Keepalive listener verified active | **Pass** |
| 2 | Simulate peripheral signal drop / disconnection | Event: ConnectionState.disconnected | App changes status to 'Reconnecting...'; starts exponential backoff | Reconnection timer initiated with 3s interval | **Pass** |
| 3 | Simulate peripheral signal restoration | Event: Peripheral detected in scan | App reconnects automatically and restores telemetry stream | Peripheral reconnected within 4.2 seconds; telemetry resumed | **Pass** |

**Post-Condition:** Wearable connection restored and telemetry flow continuous.

---

## Test Case 39

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Heart Rate Streaming Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_BLE_04 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** High | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE GATT Engine | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify Standard Bluetooth SIG 0x180D Heart Rate Stream Ingestion | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies reading and streaming standard 0x2A37 Heart Rate Measurement notifications with RR-interval parsing.  
**Pre-Condition :** Wearable device actively streaming heart rate data.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate Heart Rate stream card on User Dashboard | Element ID: ble_telemetry_hr_stream | Card displays pulsing heart animation and current BPM reading | Card visible with live BPM numerical readout | **Pass** |
| 2 | Observe telemetry updates over 10-second window | Interval: 1 Hz notification packets | BPM reading updates in real-time as peripheral broadcasts | BPM readings received and charted continuously (72 -> 74 -> 71 BPM) | **Pass** |
| 3 | Verify resting heart rate calculation | Calculated Resting HR: 64 BPM | Resting HR metric updates from continuous baseline | Resting HR 64 BPM displayed with timestamp indicator | **Pass** |

**Post-Condition:** Heart rate readings ingested and recorded in local health cache.

---

## Test Case 40

**Project Name:** FemSphere – Lifetime AI Health Twin Companion  
### Battery Characteristic Test Case

| Header Information | Details |
| :--- | :--- |
| **Test Case ID:** TC_BLE_05 | **Test Designed By:** KEERTHANA M |
| **Test Priority(Low/Medium/High):** Low | **Test Designed Date:** 2026-10-16 |
| **Module Name:** BLE GATT Engine | **Test Executed By :** Amal K Jose |
| **Test Title :** Verify 0x180F Battery Level Characteristic Polling & Battery Status Display | **Test Execution Date:** 2026-10-16 |

**Description:** Verifies reading 0x2A19 Battery Level characteristic returns battery percentage (0-100%) and updates low-battery alert threshold.  
**Pre-Condition :** Wearable device paired and battery service discovered.  

| Step | Test Step | Test Data | Expected Result | Actual Result | Status(Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Locate battery indicator widget on connected device card | Element ID: ble_device_battery_level | Battery percentage icon and text displayed | Battery indicator located | **Pass** |
| 2 | Read 0x2A19 characteristic value from peripheral | Characteristic: 00002a19-0000-1000-8000-00805f9b34fb | Returns single byte representing percentage (e.g. 0x55 = 85%) | GATT read returned 85%; indicator displays '85%' with green fill | **Pass** |
| 3 | Verify low-power warning threshold logic | Threshold: < 20% | Displays amber battery warning when reading drops below 20% | Low battery threshold rule evaluated; normal state confirmed (85%) | **Pass** |

**Post-Condition:** Wearable battery telemetry updated and monitored for low power states.

---
