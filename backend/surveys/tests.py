import json
import os

from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


class ExportJsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("surveys:export_js")

        self.payloadSuccess = {
            "attributes": [
                {
                    "name": "att1",
                    "levels": [
                        {"name": "level1", "weight": 0.5},
                        {"name": "another1", "weight": 0.5},
                    ],
                    "locked": False,
                },
                {
                    "name": "att2",
                    "levels": [
                        {"name": "level2", "weight": 0.2},
                        {"name": "another2", "weight": 0.8},
                    ],
                    "locked": True,
                },
                {
                    "name": "att3",
                    "levels": [
                        {"name": "level3", "weight": 0.9},
                        {"name": "another3", "weight": 0.1},
                    ],
                    "locked": False,
                },
            ],
            "restrictions": [
                {
                    "condition": [
                        {"attribute": "att1", "operation": "==", "value": "level1"},
                        {
                            "logical": "||",
                            "attribute": "att2",
                            "operation": "==",
                            "value": "level2",
                        },
                    ],
                    "result": [
                        {"attribute": "att3", "operation": "!=", "value": "level3"}
                    ],
                }
            ],
            "cross_restrictions": [],
            "filename": "survey.js",
            "advanced": {},
            "num_profiles": 2,
            "num_tasks": 5,
            "randomize": True,
            "repeated_tasks": False,
            "random": False,
            "task_to_repeat": 0,
            "where_to_repeat": 0,
            "repeated_tasks_flipped": False,
            "csv_lines": 500,
        }

        self.payloadFailure = {
            "attributes": [
                {
                    "name": "asfasf",
                },
                {
                    "levels": [
                        {"name": "3", "weight": 0.5},
                        {"name": "4", "weight": 0.5},
                    ],
                },
            ],
            "filename": "survey.js",
        }

    def test_export_js_success(self):
        response = self.client.post(self.url, self.payloadSuccess, format="json")
        self.assertEqual(response.status_code, 201)

    def test_export_js_failure(self):
        response = self.client.get(self.url, self.payloadSuccess, format="json")
        self.assertEqual(response.status_code, 405)


class PreviewSurveyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("surveys:preview_survey")

    def test_preview_survey_success(self):
        # Data for a successful request
        data = {
            "attributes": [
                {
                    "name": "att1",
                    "levels": [{"name": "level1"}, {"name": "another1"}],
                    "locked": True,
                },
                {
                    "name": "att2",
                    "levels": [{"name": "level2"}, {"name": "another2"}],
                    "locked": False,
                },
                {
                    "name": "att3",
                    "levels": [{"name": "level3"}, {"name": "another3"}],
                    "locked": False,
                },
            ],
            "num_profiles": 2,
            "filename": "preview",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_preview_survey_with_rest_success(self):
        # Data for a successful request
        data = {
            "attributes": [
                {"name": "att1", "levels": [{"name": "level1"}, {"name": "another1"}]},
                {"name": "att2", "levels": [{"name": "level2"}, {"name": "another2"}]},
                {"name": "att3", "levels": [{"name": "level3"}, {"name": "another3"}]},
            ],
            "restrictions": [
                {
                    "condition": [
                        {"attribute": "att1", "operation": "==", "value": "level1"},
                        {
                            "logical": "||",
                            "attribute": "att2",
                            "operation": "==",
                            "value": "level2",
                        },
                    ],
                    "result": [
                        {"attribute": "att3", "operation": "!=", "value": "level3"}
                    ],
                }
            ],
            "num_profiles": 2,
            "filename": "preview",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_preview_survey_with_rest_failure(self):
        # Data with wrong operation in condition
        data = {
            "attributes": [
                {"name": "att1", "levels": [{"name": "level1"}, {"name": "another1"}]},
                {"name": "att2", "levels": [{"name": "level2"}, {"name": "another2"}]},
                {"name": "att3", "levels": [{"name": "level3"}, {"name": "another3"}]},
            ],
            "restrictions": [
                {
                    "condition": [
                        {"attribute": "att1", "operation": "=", "value": "level1"}
                    ],
                    "result": [
                        {"attribute": "att3", "operation": "!=", "value": "level3"}
                    ],
                }
            ],
            "num_profiles": 2,
            "filename": "preview",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
        self.assertIn(
            "Invalid operation in condition.", response.data["non_field_errors"][0]
        )

    def test_preview_survey_no_levels(self):
        # Data where an attribute has no levels
        data = {
            "attributes": [{"name": "attr1", "levels": []}],
            "num_profiles": 2,
            "filename": "preview",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "Cannot export. Some attributes have no levels.",
            response.data["attributes"],
        )

    def test_preview_survey_invalid_data(self):
        # Data with no attributes
        data = {}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_preview_survey_with_cross_rest_success(self):
        # Data for a successful request
        data = {
            "attributes": [
                {
                    "name": "att1",
                    "levels": [
                        {"name": "level1"},
                        {"name": "another1"},
                    ],
                },
                {
                    "name": "att2",
                    "levels": [
                        {"name": "level2"},
                        {"name": "another2"},
                    ],
                },
                {
                    "name": "att3",
                    "levels": [
                        {"name": "level3"},
                        {"name": "another3"},
                    ],
                },
            ],
            "cross_restrictions": [
                {
                    "condition": {
                        "attribute": "att1",
                        "operation": "!=",
                        "value": "level1",
                    },
                    "result": {
                        "attribute": "att1",
                        "operation": "==",
                        "value": "another1",
                    },
                }
            ],
            "num_profiles": 2,
            "filename": "preview",
        }
        for _ in range(100):
            response = self.client.post(self.url, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(
                response.json()["previews"][0]["att1"],
                response.json()["previews"][1]["att1"],
            )

    def test_preview_survey_with_cross_rest_success_2(self):
        # Data for a successful request
        data = {
            "attributes": [
                {
                    "name": "att1",
                    "levels": [
                        {"name": "level1"},
                        {"name": "another1"},
                    ],
                },
                {
                    "name": "att2",
                    "levels": [
                        {"name": "level2"},
                        {"name": "another2"},
                    ],
                },
                {
                    "name": "att3",
                    "levels": [
                        {"name": "level3"},
                        {"name": "another3"},
                    ],
                },
            ],
            "cross_restrictions": [
                {
                    "condition": {
                        "attribute": "att1",
                        "operation": "==",
                        "value": "level1",
                    },
                    "result": {
                        "attribute": "att1",
                        "operation": "==",
                        "value": "another1",
                    },
                }
            ],
            "num_profiles": 2,
            "filename": "preview",
        }
        for _ in range(100):
            response = self.client.post(self.url, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertIn(
                "another1",
                set(
                    (
                        response.json()["previews"][0]["att1"],
                        response.json()["previews"][1]["att1"],
                    )
                ),
            )


class ExportCsvTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("surveys:export_csv")

    def test_export_csv_success(self):
        # Data for a successful request
        data = {
            "attributes": [
                {
                    "name": "att1",
                    "levels": [
                        {"name": "lvl1"},
                        {"name": "another1"},
                        {"name": "bruh1"},
                    ],
                },
                {
                    "name": "att2",
                    "levels": [
                        {"name": "lvl2"},
                        {"name": "another2"},
                        {"name": "bruh2"},
                    ],
                },
                {
                    "name": "att3",
                    "levels": [
                        {"name": "lvl3"},
                        {"name": "another3"},
                        {"name": "bruh3"},
                    ],
                },
                {
                    "name": "att4",
                    "levels": [
                        {"name": "lvl4"},
                        {"name": "another4"},
                        {"name": "bruh4"},
                    ],
                },
                {
                    "name": "att5",
                    "levels": [
                        {"name": "lvl5"},
                        {"name": "another5"},
                        {"name": "bruh5"},
                    ],
                },
                {
                    "name": "att6",
                    "levels": [
                        {"name": "lvl6"},
                        {"name": "another6"},
                        {"name": "bruh6"},
                    ],
                },
            ],
            "num_profiles": 2,
            "csv_lines": 10000,
            "filename": "survey.csv",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_export_csv_with_rest_success(self):
        # Data for a successful request
        data = {
            "attributes": [
                {"name": "att1", "levels": [{"name": "level1"}, {"name": "another1"}]},
                {"name": "att2", "levels": [{"name": "level2"}, {"name": "another2"}]},
                {"name": "att3", "levels": [{"name": "level3"}, {"name": "another3"}]},
            ],
            "restrictions": [
                {
                    "condition": [
                        {"attribute": "att1", "operation": "==", "value": "level1"},
                        {
                            "logical": "||",
                            "attribute": "att2",
                            "operation": "==",
                            "value": "level2",
                        },
                    ],
                    "result": [
                        {"attribute": "att3", "operation": "!=", "value": "level3"}
                    ],
                }
            ],
            "num_profiles": 2,
            "filename": "survey.csv",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_export_csv_no_levels(self):
        # Data where an attribute has no levels
        data = {
            "attributes": [{"name": "attr1", "levels": []}],
            "num_profiles": 2,
            "filename": "survey.csv",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "Cannot export. Some attributes have no levels.",
            response.data["attributes"],
        )

    def test_export_csv_invalid_data(self):
        # Example of sending invalid data
        data = {}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ExportJsonTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("surveys:export_json")
        self.data = {
            "attributes": [
                {
                    "name": "att1",
                    "locked": True,
                    "levels": [
                        {"name": "level1", "weight": 0.5},
                        {"name": "another1", "weight": 0.5},
                    ],
                },
                {
                    "name": "att2",
                    "locked": False,
                    "levels": [
                        {"name": "level2", "weight": 0.2},
                        {"name": "another2", "weight": 0.8},
                    ],
                },
                {
                    "name": "att3",
                    "locked": False,
                    "levels": [
                        {"name": "level3", "weight": 0.9},
                        {"name": "another3", "weight": 0.1},
                    ],
                },
            ],
            "restrictions": [
                {
                    "condition": [
                        {"attribute": "att1", "operation": "==", "value": "level1"},
                        {
                            "logical": "||",
                            "attribute": "att2",
                            "operation": "==",
                            "value": "level2",
                        },
                    ],
                    "result": [
                        {"attribute": "att3", "operation": "!=", "value": "level3"}
                    ],
                }
            ],
            "cross_restrictions": [],
            "num_profiles": 2,
            "filename": "survey_export.json",
        }

    def test_export_json_success(self):
        response = self.client.post(self.url, self.data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(
            response["Content-Disposition"], 'attachment; filename="survey_export.json"'
        )


class ImportJsonTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("surveys:import_json")
        self.file_path = os.path.join(
            settings.BASE_DIR, "surveys", "tests", "test_data", "valid_survey.json"
        )

    def test_import_valid_json(self):
        with open(self.file_path, "rb") as file:
            uploaded_file = SimpleUploadedFile(
                "valid_survey.json", file.read(), content_type="application/json"
            )

        # Make POST request with the uploaded file
        response = self.client.post(
            self.url, {"file": uploaded_file}, format="multipart"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            json.loads(response.content.decode("utf-8")),
            json.load(open(self.file_path, "r")),
        )

    def test_import_invalid_json(self):
        # Malformed JSON data as bytes
        invalid_json_data = b'{"key": "value"'  # Missing closing brace

        # Wrap the malformed data in SimpleUploadedFile
        uploaded_file = SimpleUploadedFile(
            "invalid_survey.json", invalid_json_data, content_type="application/json"
        )

        # Make POST request with the uploaded file
        response = self.client.post(
            self.url, {"file": uploaded_file}, format="multipart"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())
        self.assertTrue("Invalid JSON data" in response.json()["error"])


class QualtricsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url_import = reverse("surveys:import_qsf")
        self.url_export = reverse("surveys:export_qsf")
        self.payloadSuccess = {
            "attributes": [
                {
                    "name": "att1",
                    "levels": [
                        {"name": "level1", "weight": 0.5},
                        {"name": "another1", "weight": 0.5},
                    ],
                    "locked": False,
                },
                {
                    "name": "att2",
                    "levels": [
                        {"name": "level2", "weight": 0.2},
                        {"name": "another2", "weight": 0.8},
                    ],
                    "locked": True,
                },
                {
                    "name": "att3",
                    "levels": [
                        {"name": "level3", "weight": 0.9},
                        {"name": "another3", "weight": 0.1},
                    ],
                    "locked": False,
                },
            ],
            "restrictions": [
                {
                    "condition": [
                        {"attribute": "att1", "operation": "==", "value": "level1"},
                        {
                            "logical": "||",
                            "attribute": "att2",
                            "operation": "==",
                            "value": "level2",
                        },
                    ],
                    "result": [
                        {"attribute": "att3", "operation": "!=", "value": "level3"}
                    ],
                }
            ],
            "cross_restrictions": [],
            "filename": "survey.qsf",
            "advanced": {},
            "num_profiles": 2,
            "num_tasks": 5,
            "randomize": True,
            "repeated_tasks": False,
            "random": False,
            "task_to_repeat": 0,
            "where_to_repeat": 0,
            "repeated_tasks_flipped": False,
            "csv_lines": 500,
        }
        self.valid_survey_path = os.path.join(
            settings.BASE_DIR, "surveys", "tests", "test_data", "valid_survey.json"
        )
        self.qsf_path = os.path.join(
            settings.BASE_DIR, "surveys", "tests", "test_data", "survey.qsf"
        )

    def test_import_qsf_valid(self):
        with open(self.qsf_path, "rb") as file:
            uploaded_file = SimpleUploadedFile(
                self.qsf_path, file.read(), content_type="multipart/form-data"
            )

        response = self.client.post(
            self.url_import, {"file": uploaded_file}, format="multipart"
        )

        valid_survey = json.load(open(self.valid_survey_path, "r"))
        valid_survey["filename"] = "survey.qsf"

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(json.loads(response.content.decode("utf-8")), valid_survey)

    def test_import_qsf_invalid(self):
        # Malformed JSON data as bytes
        invalid_json_data = b'{"key": "value"'

        # Wrap the malformed data in SimpleUploadedFile
        uploaded_file = SimpleUploadedFile(
            "invalid_qsf.qsf", invalid_json_data, content_type="multipart/form-data"
        )

        # Make POST request with the uploaded file
        response = self.client.post(
            self.url_import, {"file": uploaded_file}, format="multipart"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())
        self.assertTrue("Invalid QSF data" in response.json()["error"])

    def test_export_qsf_valid(self):
        response = self.client.post(self.url_export, self.payloadSuccess, format="json")

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertEquals(
            response["Content-Disposition"], 'attachment; filename="survey.qsf"'
        )
