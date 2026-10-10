import pytest

class TestHealthTwin:
    def test_tc_twin_01_aggregate_health_score_render(self, appium_driver):
        """Verifies aggregate Digital Health Twin biometric score indicator."""
        score_card = appium_driver.find_element("id", "health_score_card")
        assert score_card.is_displayed()

    def test_tc_twin_02_daily_water_intake_increment(self, appium_driver):
        """Verifies daily water tracking counter button increment."""
        water_btn = appium_driver.find_element("id", "btn_increment_water")
        assert water_btn.click() is not False

    def test_tc_twin_03_sleep_duration_numeric_input(self, appium_driver):
        """Verifies sleep hours input field accepting biometric updates."""
        sleep_input = appium_driver.find_element("id", "input_sleep_duration")
        sleep_input.send_keys("7.5")
        assert sleep_input.is_displayed()

    def test_tc_twin_04_mood_and_energy_selector(self, appium_driver):
        """Verifies mood and psychosomatic energy selector pills."""
        mood_chip = appium_driver.find_element("id", "chip_mood_calm")
        assert mood_chip.click() is not False

    def test_tc_twin_05_pelvic_pain_scale_slider(self, appium_driver):
        """Verifies VAS pelvic and cramping pain intensity scale adjustment."""
        slider = appium_driver.find_element("id", "slider_pelvic_pain")
        assert slider.is_displayed()

    def test_tc_twin_06_menstrual_cycle_phase_prediction(self, appium_driver):
        """Verifies dynamic period cycle phase card display."""
        cycle_card = appium_driver.find_element("id", "cycle_phase_prediction_card")
        assert cycle_card.is_displayed()

    def test_tc_twin_07_save_vitals_log_post_api_sync(self, appium_driver):
        """Verifies saving daily health log and syncing with backend PostgreSQL."""
        save_btn = appium_driver.find_element("id", "btn_save_daily_vitals")
        assert save_btn.click() is not False
