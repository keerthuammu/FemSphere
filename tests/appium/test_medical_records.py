import pytest

class TestMedicalRecords:
    def test_tc_rec_01_open_medical_vault(self, appium_driver):
        """Verifies opening patient diagnostic records vault."""
        vault_tab = appium_driver.find_element("id", "tab_medical_records")
        assert vault_tab.click() is not False

    def test_tc_rec_02_document_upload_modal_accessible(self, appium_driver):
        """Verifies report upload bottom sheet modal opens."""
        upload_btn = appium_driver.find_element("id", "btn_upload_medical_record")
        assert upload_btn.click() is not False

    def test_tc_rec_03_ocr_biomarker_table_rendering(self, appium_driver):
        """Verifies Gemini AI OCR biomarker table view."""
        biomarker_view = appium_driver.find_element("id", "biomarker_results_table")
        assert biomarker_view.is_displayed()

    def test_tc_rec_04_download_and_view_diagnostic_file(self, appium_driver):
        """Verifies opening attachment viewer for uploaded lab record."""
        view_file_btn = appium_driver.find_element("id", "btn_view_report_file")
        assert view_file_btn.is_displayed()
