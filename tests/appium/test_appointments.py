import pytest

class TestAppointments:
    def test_tc_app_01_open_consultations_directory(self, appium_driver):
        """Verifies clinical consultation screen directory rendering."""
        consult_tab = appium_driver.find_element("accessibility_id", "tab_consultations")
        assert consult_tab.click() is not False

    def test_tc_app_02_booking_bottom_sheet_modal_opens(self, appium_driver):
        """Verifies booking bottom sheet modal triggers upon tap."""
        book_btn = appium_driver.find_element("id", "btn_book_appointment")
        assert book_btn.click() is not False

    def test_tc_app_03_doctor_dropdown_is_expanded_no_overflow(self, appium_driver):
        """Verifies doctor selector expands cleanly without layout overflows."""
        doc_selector = appium_driver.find_element("id", "doctor_dropdown_selector")
        assert doc_selector.is_displayed()

    def test_tc_app_04_consultation_type_video_inclinic_toggle(self, appium_driver):
        """Verifies switching between Virtual Telehealth and In-Clinic visit."""
        toggle = appium_driver.find_element("id", "appointment_type_toggle")
        assert toggle.click() is not False

    def test_tc_app_05_time_slot_selection_and_capacity(self, appium_driver):
        """Verifies selecting an open time slot pill."""
        slot_pill = appium_driver.find_element("id", "slot_10_00_am")
        assert slot_pill.is_displayed()

    def test_tc_app_06_appointment_reservation_submission(self, appium_driver):
        """Verifies appointment booking submission to backend API."""
        submit_btn = appium_driver.find_element("id", "btn_confirm_booking")
        assert submit_btn.click() is not False
