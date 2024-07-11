import os

from django.conf import settings
from django.test import TestCase
from django.urls import reverse


class DocumentTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # document file path
        cls.document_file = os.path.join(settings.BASE_DIR, "../docs", "example.md")

        # Populate the document markdown file with some content
        with open(cls.document_file, "w") as file:
            file.write("# Example Document\n This is an example document content.")

    @classmethod
    def tearDownClass(cls):
        # Clean up by removing the directory after tests run
        os.remove(cls.document_file)
        super().tearDownClass()

    def test_document_retrieval(self):
        # Get the URL for the document retrieval view
        url = reverse("get_doc", kwargs={"identifier": "example"})
        response = self.client.get(url)

        # Check that the response is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the Markdown content was converted to HTML
        expected_html = (
            "<h1>Example Document</h1>\n<p>This is an example document content.</p>\n"
        )
        self.assertHTMLEqual(response.content.decode("utf-8"), expected_html)

    def test_document_not_found(self):
        # Test retrieval of a non-existent document
        url = reverse("get_doc", kwargs={"identifier": "nonexistent"})
        response = self.client.get(url)

        # Check that the response is 404 Not Found
        self.assertEqual(response.status_code, 404)


class DocumentationFileTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a temporary directory and add some Markdown files
        cls.docs_path = os.path.join(settings.BASE_DIR, "../docs")
        cls.files = ["test1.md", "test2.md", "not_a_md_file.txt"]
        for file in cls.files:
            with open(os.path.join(cls.docs_path, file), "w") as f:
                f.write(f"Content for {file}")

    @classmethod
    def tearDownClass(cls):
        # Clean up by removing the directory after tests run
        for file in cls.files:
            os.remove(os.path.join(cls.docs_path, file))
        super().tearDownClass()

    def test_list_markdown_files(self):
        response = self.client.get(reverse("list_docs"))
        self.assertEqual(response.status_code, 200)

        expected_files = ["test1.md", "test2.md"]
        response_files = response.json()

        # Check that each expected file is in the response
        for file_name in expected_files:
            self.assertIn(file_name, response_files)
