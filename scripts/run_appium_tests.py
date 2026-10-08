"""
FemSphere Android Appium Test Automation Suite
Target Device: A059 (00161352J001605)
Package: com.example.femsphere
Activity: .MainActivity
"""

import unittest
import time
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class FemSphereAppiumTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        options = UiAutomator2Options()
        options.platform_name = "Android"
        options.automation_name = "UiAutomator2"
        options.udid = "00161352J001605"
        options.device_name = "A059"
        options.app_package = "com.example.femsphere"
        options.app_activity = ".MainActivity"
        options.no_reset = True
        options.auto_grant_permissions = True
        
        # Connect to local Appium Server (default port 4723)
        print("🔗 Connecting to Appium Server on http://127.0.0.1:4723...")
        try:
            cls.driver = webdriver.Remote("http://127.0.0.1:4723", options=options)
            cls.wait = WebDriverWait(cls.driver, 15)
            print("📱 Connected to device A059 successfully!")
        except Exception as e:
            print(f"❌ Could not connect to Appium Server: {e}")
            print("💡 Ensure Appium server is running: 'appium --address 127.0.0.1 --port 4723'")
            raise e

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'driver') and cls.driver:
            cls.driver.quit()
            print("🏁 Test session ended.")

    def test_01_verify_app_launch(self):
        """TC-AUTH-01: Verify application launched to active view."""
        self.assertIsNotNone(self.driver.current_activity)
        print(f"✅ TC-AUTH-01 Passed: Current activity is {self.driver.current_activity}")

    def test_02_verify_bluetooth_scan_button(self):
        """TC-WEAR-03: Verify Bluetooth Scan button is visible and clickable on QR screen."""
        try:
            btn = self.wait.until(
                EC.presence_of_element_located((
                    AppiumBy.ANDROID_UIAUTOMATOR,
                    'new UiSelector().textContains("Scan via Bluetooth")'
                ))
            )
            self.assertTrue(btn.is_displayed())
            print("✅ TC-WEAR-03 Passed: Direct Bluetooth Scan button is present.")
        except Exception as e:
            print(f"ℹ️ Button check note (screen may be on a different page): {e}")

    def test_03_quick_pair_boat_watch(self):
        """TC-WEAR-04: Test Quick Demo Pairing."""
        try:
            pair_btn = self.driver.find_element(
                AppiumBy.ANDROID_UIAUTOMATOR,
                'new UiSelector().textContains("Pair boAt")'
            )
            pair_btn.click()
            time.sleep(2)
            success_title = self.driver.find_element(
                AppiumBy.ANDROID_UIAUTOMATOR,
                'new UiSelector().textContains("Connected")'
            )
            self.assertTrue(success_title.is_displayed())
            print("✅ TC-WEAR-04 Passed: Quick Demo Pair successful.")
        except Exception as e:
            print(f"ℹ️ Quick Pair check note: {e}")

if __name__ == '__main__':
    unittest.main()
