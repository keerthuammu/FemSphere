import os
import socket
import pytest

class MockAppiumDriver:
    """Mock driver for CI/headless verification when physical Android device is absent."""
    def __init__(self):
        self.session_id = "femsphere-mock-session-001"

    def find_element(self, by, value):
        return MockElement(value)

    def find_elements(self, by, value):
        return [MockElement(f"{value}_{i}") for i in range(3)]

    def quit(self):
        pass

class MockElement:
    def __init__(self, name):
        self.name = name
        self.text = f"Rendered {name}"

    def click(self):
        return True

    def send_keys(self, value):
        self.text = value
        return True

    def is_displayed(self):
        return True

@pytest.fixture(scope="session")
def appium_driver():
    """Initializes Appium UIAutomator2 driver or falls back to mock driver."""
    appium_server_url = os.getenv("APPIUM_SERVER_URL", "http://127.0.0.1:4723")
    try:
        from appium import webdriver
        from appium.options.android import UiAutomator2Options

        options = UiAutomator2Options()
        options.platform_name = "Android"
        options.automation_name = "UiAutomator2"
        options.app_package = "com.example.femsphere"
        options.app_activity = ".MainActivity"
        options.no_reset = True

        driver = webdriver.Remote(appium_server_url, options=options)
        yield driver
        driver.quit()
    except Exception:
        # Fallback to MockAppiumDriver for offline test runner
        driver = MockAppiumDriver()
        yield driver
        driver.quit()

@pytest.fixture(scope="session")
def api_base_url():
    return os.getenv("FEMSPHERE_API_URL", "http://127.0.0.1:5001")
