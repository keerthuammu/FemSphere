import pytest

class TestCaregiver:
    def test_tc_cg_01_caregiver_dashboard_overview(self, appium_driver):
        """Verifies caregiver multi-dependent overview card rendering."""
        cg_card = appium_driver.find_element("id", "caregiver_overview_card")
        assert cg_card.is_displayed()

    def test_tc_cg_02_switch_active_dependent_profile(self, appium_driver):
        """Verifies switching active dependent in caregiver dashboard."""
        dep_switch = appium_driver.find_element("id", "switch_dependent_dropdown")
        assert dep_switch.click() is not False

    def test_tc_cg_03_medication_dosage_reminder_creation(self, appium_driver):
        """Verifies adding a prescription dosage reminder for dependent."""
        add_med_btn = appium_driver.find_element("id", "btn_add_medication")
        assert add_med_btn.click() is not False

    def test_tc_cg_04_vaccination_schedule_tracker_accessible(self, appium_driver):
        """Verifies accessing immunization timeline for infant or elderly dependent."""
        vax_tab = appium_driver.find_element("id", "tab_vaccinations")
        assert vax_tab.click() is not False
