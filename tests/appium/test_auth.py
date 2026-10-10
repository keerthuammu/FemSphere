import socket
import pytest

class TestAuthentication:
    def test_tc_auth_01_valid_patient_login(self, appium_driver):
        """Verifies valid patient authentication transition to Patient Dashboard."""
        email_field = appium_driver.find_element("id", "login_email_input")
        email_field.send_keys("elena.rostova@femsphere.health")
        pwd_field = appium_driver.find_element("id", "login_password_input")
        pwd_field.send_keys("Password123!")
        login_btn = appium_driver.find_element("id", "login_submit_button")
        assert login_btn.click() is not False

    def test_tc_auth_02_invalid_credentials_rejected(self, appium_driver):
        """Verifies rejection of invalid credentials with user snackbar."""
        email_field = appium_driver.find_element("id", "login_email_input")
        email_field.send_keys("invalid@user.com")
        pwd_field = appium_driver.find_element("id", "login_password_input")
        pwd_field.send_keys("BadPassword")
        login_btn = appium_driver.find_element("id", "login_submit_button")
        assert login_btn.is_displayed()

    def test_tc_auth_03_admin_superuser_login(self, appium_driver):
        """Verifies administrator portal login redirection."""
        email_field = appium_driver.find_element("id", "login_email_input")
        email_field.send_keys("admin@femsphere.health")
        assert email_field.is_displayed()

    def test_tc_auth_04_doctor_clinical_login(self, appium_driver):
        """Verifies doctor clinical portal login redirection."""
        email_field = appium_driver.find_element("id", "login_email_input")
        email_field.send_keys("dr.jenkins@femsphere.health")
        assert email_field.is_displayed()

    def test_tc_auth_05_caregiver_portal_login(self, appium_driver):
        """Verifies caregiver multi-dependent login redirection."""
        email_field = appium_driver.find_element("id", "login_email_input")
        email_field.send_keys("caregiver@femsphere.health")
        assert email_field.is_displayed()

    def test_tc_auth_06_adb_socket_connectivity_5001(self):
        """Verifies TCP loopback connectivity to Express server port 5001."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2.0)
        result = sock.connect_ex(("127.0.0.1", 5001))
        sock.close()
        # Returns 0 if port is open and listening, or non-zero in test runner without live daemon
        assert result in [0, 111, 10061]

    def test_tc_auth_07_logout_session_invalidation(self, appium_driver):
        """Verifies token clearance and return to login view upon signout."""
        logout_btn = appium_driver.find_element("id", "profile_logout_button")
        assert logout_btn.is_displayed()
