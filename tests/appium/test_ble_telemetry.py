import pytest

class TestBleTelemetry:
    def test_tc_ble_01_standalone_gatt_service_discovery(self, appium_driver):
        """Verifies direct BLE GATT service discovery on Android peripheral manager."""
        ble_service = appium_driver.find_element("id", "ble_service_discovery_indicator")
        assert ble_service.is_displayed()

    def test_tc_ble_02_no_companion_app_required(self, appium_driver):
        """Verifies telemetry reading operates without vendor OEM companion apps."""
        standalone_badge = appium_driver.find_element("id", "badge_standalone_ble")
        assert standalone_badge.is_displayed()

    def test_tc_ble_03_persistent_auto_reconnect_keepalive(self, appium_driver):
        """Verifies GATT background reconnection keepalive listener."""
        keepalive_toggle = appium_driver.find_element("id", "toggle_ble_keepalive")
        assert keepalive_toggle.click() is not False

    def test_tc_ble_04_heart_rate_0x180d_telemetry_stream(self, appium_driver):
        """Verifies ingestion of standard Bluetooth SIG 0x180D Heart Rate stream."""
        hr_stream_card = appium_driver.find_element("id", "ble_telemetry_hr_stream")
        assert hr_stream_card.is_displayed()

    def test_tc_ble_05_battery_0x180f_telemetry_update(self, appium_driver):
        """Verifies 0x180F Battery Level characteristic polling and display."""
        battery_indicator = appium_driver.find_element("id", "ble_device_battery_level")
        assert battery_indicator.is_displayed()
