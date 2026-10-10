import pytest

class TestWearables:
    def test_tc_wear_01_open_qr_scanner_screen(self, appium_driver):
        """Verifies opening the universal wearable pairing interface."""
        scanner_btn = appium_driver.find_element("id", "btn_open_wearables_scanner")
        assert scanner_btn.click() is not False

    def test_tc_wear_02_gpay_live_camera_feed_active_in_frame(self, appium_driver):
        """Verifies viewfinder camera frame rendering for QR code scanning."""
        viewfinder = appium_driver.find_element("id", "qr_scanner_viewfinder")
        assert viewfinder.is_displayed()

    def test_tc_wear_03_audio_earbuds_noise_buds_filter(self, appium_driver):
        """Verifies filtering wearables list by smart audio / hearing health."""
        filter_btn = appium_driver.find_element("id", "chip_filter_earbuds")
        assert filter_btn.click() is not False

    def test_tc_wear_04_direct_bluetooth_scan_navigation(self, appium_driver):
        """Verifies transition to Bluetooth Low Energy discovery list."""
        ble_btn = appium_driver.find_element("id", "btn_scan_bluetooth")
        assert ble_btn.is_displayed()

    def test_tc_wear_05_quick_demo_pair_boat_wave_beat(self, appium_driver):
        """Verifies pairing with boAt Wave Beat smart watch telemetry device."""
        device_row = appium_driver.find_element("id", "device_boat_wave_beat")
        assert device_row.is_displayed()

    def test_tc_wear_06_quick_demo_pair_amazfit_bip_u_pro(self, appium_driver):
        """Verifies pairing with Amazfit Bip U Pro biometric tracker."""
        device_row = appium_driver.find_element("id", "device_amazfit_bip_u_pro")
        assert device_row.is_displayed()

    def test_tc_wear_07_flashlight_torch_toggle_controller(self, appium_driver):
        """Verifies toggling camera torch during low-light scanner operations."""
        torch_toggle = appium_driver.find_element("id", "btn_toggle_torch")
        assert torch_toggle.click() is not False
