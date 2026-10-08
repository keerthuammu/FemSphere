================================================================================
FEMSPHERE END-TO-END APPIUM AUTOMATED TESTING REPORT
Terminal Execution Output by Test Suite
================================================================================
Project: FemSphere – Lifetime AI Health Twin Companion Platform
Test Automation Engineer: KEERTHANA M (Lead QA Automation)
Testing Framework: Python 3.14.0 | pytest 9.1.1 | Appium 2.x | UiAutomator2 8.7.0
Target Device: Android 14 (A059 | UDID: 00161352J001605)
Application Package: com.example.femsphere (.MainActivity)
Execution Date: October 8, 2026
Overall Result: ALL 40 TEST CASES PASSED (100% PASS RATE, 0 FAILURES)
HTML Report: tests/appium/reports/test_report.html
================================================================================

--------------------------------------------------------------------------------
SUITE 1: AUTHENTICATION & MULTI-ROLE ACCESS
File: tests/appium/test_auth.py
Command: python -m pytest tests/appium/test_auth.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 7 items

tests/appium/test_auth.py::TestAuthentication::test_tc_auth_01_valid_patient_login PASSED         [ 14%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_02_invalid_credentials_rejected PASSED [ 28%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_03_admin_superuser_login PASSED       [ 42%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_04_doctor_clinical_login PASSED       [ 57%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_05_caregiver_portal_login PASSED      [ 71%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_06_adb_socket_connectivity_5001 PASSED [ 85%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_07_logout_session_invalidation PASSED  [100%]

============================== 7 passed in 41.22s ==============================


--------------------------------------------------------------------------------
SUITE 2: TELEHEALTH & CLINICAL CONSULTATION SCHEDULING
File: tests/appium/test_appointments.py
Command: python -m pytest tests/appium/test_appointments.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 6 items

tests/appium/test_appointments.py::TestAppointments::test_tc_app_01_open_consultations_directory PASSED             [ 16%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_02_booking_bottom_sheet_modal_opens PASSED         [ 33%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_03_doctor_dropdown_is_expanded_no_overflow PASSED [ 50%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_04_consultation_type_video_inclinic_toggle PASSED  [ 66%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_05_time_slot_selection_and_capacity PASSED         [ 83%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_06_appointment_reservation_submission PASSED        [100%]

============================== 6 passed in 51.48s ==============================


--------------------------------------------------------------------------------
SUITE 3: UNIVERSAL WEARABLES & LIVE GPAY-STYLE QR SCANNER
File: tests/appium/test_wearables.py
Command: python -m pytest tests/appium/test_wearables.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 7 items

tests/appium/test_wearables.py::TestWearables::test_tc_wear_01_open_qr_scanner_screen PASSED                     [ 14%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_02_gpay_live_camera_feed_active_in_frame PASSED      [ 28%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_03_audio_earbuds_noise_buds_filter PASSED           [ 42%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_04_direct_bluetooth_scan_navigation PASSED           [ 57%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_05_quick_demo_pair_boat_wave_beat PASSED             [ 71%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_06_quick_demo_pair_amazfit_bip_u_pro PASSED          [ 85%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_07_flashlight_torch_toggle_controller PASSED         [100%]

============================== 7 passed in 49.36s ==============================


--------------------------------------------------------------------------------
SUITE 4: DIGITAL HEALTH TWIN & DAILY VITALS TRACKER
File: tests/appium/test_health_twin.py
Command: python -m pytest tests/appium/test_health_twin.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 7 items

tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_01_aggregate_health_score_render PASSED          [ 14%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_02_daily_water_intake_increment PASSED           [ 28%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_03_sleep_duration_numeric_input PASSED           [ 42%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_04_mood_and_energy_selector PASSED               [ 57%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_05_pelvic_pain_scale_slider PASSED                [ 71%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_06_menstrual_cycle_phase_prediction PASSED       [ 85%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_07_save_vitals_log_post_api_sync PASSED           [100%]

============================== 7 passed in 53.64s ==============================


--------------------------------------------------------------------------------
SUITE 5: CAREGIVER MULTI-DEPENDENT VAULT & MEDS
File: tests/appium/test_caregiver.py
Command: python -m pytest tests/appium/test_caregiver.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 4 items

tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_01_caregiver_dashboard_overview PASSED                [ 25%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_02_switch_active_dependent_profile PASSED             [ 50%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_03_medication_dosage_reminder_creation PASSED        [ 75%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_04_vaccination_schedule_tracker_accessible PASSED     [100%]

============================== 4 passed in 33.12s ==============================


--------------------------------------------------------------------------------
SUITE 6: CLINICAL RECORDS & AI OCR SCANNING
File: tests/appium/test_medical_records.py
Command: python -m pytest tests/appium/test_medical_records.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 4 items

tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_01_open_medical_vault PASSED               [ 25%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_02_document_upload_modal_accessible PASSED [ 50%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_03_ocr_biomarker_table_rendering PASSED    [ 75%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_04_download_and_view_diagnostic_file PASSED [100%]

============================== 4 passed in 31.85s ==============================


--------------------------------------------------------------------------------
SUITE 7: BLE GATT STANDALONE AUTO-RECONNECT & TELEMETRY STREAM
File: tests/appium/test_ble_telemetry.py
Command: python -m pytest tests/appium/test_ble_telemetry.py -v
--------------------------------------------------------------------------------
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
collected 5 items

tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_01_standalone_gatt_service_discovery PASSED   [ 20%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_02_no_companion_app_required PASSED          [ 40%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_03_persistent_auto_reconnect_keepalive PASSED  [ 60%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_04_heart_rate_0x180d_telemetry_stream PASSED   [ 80%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_05_battery_0x180f_telemetry_update PASSED     [100%]

============================== 5 passed in 35.19s ==============================


================================================================================
FULL SUITE CONSOLIDATED EXECUTION (ALL 40 TESTS)
Command: python -m pytest tests/appium --html=tests/appium/reports/test_report.html --self-contained-html -v
================================================================================
============================= test session starts =============================
platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\mkeer\Downloads\remix-femsphere
plugins: html-4.2.0, metadata-3.1.1
collected 40 items

tests/appium/test_appointments.py::TestAppointments::test_tc_app_01_open_consultations_directory PASSED             [  2%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_02_booking_bottom_sheet_modal_opens PASSED         [  5%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_03_doctor_dropdown_is_expanded_no_overflow PASSED [  7%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_04_consultation_type_video_inclinic_toggle PASSED  [ 10%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_05_time_slot_selection_and_capacity PASSED         [ 12%]
tests/appium/test_appointments.py::TestAppointments::test_tc_app_06_appointment_reservation_submission PASSED        [ 15%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_01_valid_patient_login PASSED                           [ 17%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_02_invalid_credentials_rejected PASSED                  [ 20%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_03_admin_superuser_login PASSED                         [ 22%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_04_doctor_clinical_login PASSED                         [ 25%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_05_caregiver_portal_login PASSED                        [ 27%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_06_adb_socket_connectivity_5001 PASSED                  [ 30%]
tests/appium/test_auth.py::TestAuthentication::test_tc_auth_07_logout_session_invalidation PASSED                   [ 32%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_01_standalone_gatt_service_discovery PASSED     [ 35%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_02_no_companion_app_required PASSED            [ 37%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_03_persistent_auto_reconnect_keepalive PASSED    [ 40%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_04_heart_rate_0x180d_telemetry_stream PASSED     [ 42%]
tests/appium/test_ble_telemetry.py::TestBleTelemetry::test_tc_ble_05_battery_0x180f_telemetry_update PASSED       [ 45%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_01_caregiver_dashboard_overview PASSED                  [ 47%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_02_switch_active_dependent_profile PASSED               [ 50%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_03_medication_dosage_reminder_creation PASSED          [ 52%]
tests/appium/test_caregiver.py::TestCaregiver::test_tc_cg_04_vaccination_schedule_tracker_accessible PASSED       [ 55%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_01_aggregate_health_score_render PASSED            [ 57%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_02_daily_water_intake_increment PASSED             [ 60%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_03_sleep_duration_numeric_input PASSED             [ 62%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_04_mood_and_energy_selector PASSED                 [ 65%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_05_pelvic_pain_scale_slider PASSED                  [ 67%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_06_menstrual_cycle_phase_prediction PASSED         [ 70%]
tests/appium/test_health_twin.py::TestHealthTwin::test_tc_twin_07_save_vitals_log_post_api_sync PASSED             [ 72%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_01_open_medical_vault PASSED                 [ 75%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_02_document_upload_modal_accessible PASSED   [ 77%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_03_ocr_biomarker_table_rendering PASSED      [ 80%]
tests/appium/test_medical_records.py::TestMedicalRecords::test_tc_rec_04_download_and_view_diagnostic_file PASSED   [ 82%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_01_open_qr_scanner_screen PASSED                       [ 85%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_02_gpay_live_camera_feed_active_in_frame PASSED        [ 87%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_03_audio_earbuds_noise_buds_filter PASSED             [ 90%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_04_direct_bluetooth_scan_navigation PASSED             [ 92%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_05_quick_demo_pair_boat_wave_beat PASSED               [ 95%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_06_quick_demo_pair_amazfit_bip_u_pro PASSED            [ 97%]
tests/appium/test_wearables.py::TestWearables::test_tc_wear_07_flashlight_torch_toggle_controller PASSED           [100%]

- Generated html report: file:///C:/Users/mkeer/Downloads/remix-femsphere/tests/appium/reports/test_report.html -
======================= 40 passed in 248.82s (0:04:08) ========================

SUMMARY:
Total Tests: 40
Passed: 40 (100.0%)
Failed: 0
Skipped: 0
Lead QA Automation Engineer: KEERTHANA M
================================================================================
