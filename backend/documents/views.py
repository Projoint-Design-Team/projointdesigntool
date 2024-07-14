import os

import markdown
from django.conf import settings
from django.http import Http404, HttpResponse
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializer import DocumentationSerializer


@extend_schema(
    summary="Get a documentation file",
    request=DocumentationSerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            response=DocumentationSerializer,
            description="HTML content of the requested document file.",
            examples=[
                OpenApiExample(
                    name="Example Document",
                    description="An example document",
                    value="<h1>Example Document</h1>\n<p>This is an example document content.</p>\n",
                )
            ],
        ),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description="Document not found."),
    },
    description="Returns the HTML content of the requested document file.",
    tags=["Documentation"],
)
@api_view(["GET"])
def get_doc(request, identifier):
    file_path = os.path.join(settings.BASE_DIR, "docs", f"{identifier}.md")
    try:
        if not os.path.exists(file_path):
            raise Http404("Document not found")

        with open(file_path, "r") as file:
            text = file.read()
            html = markdown.markdown(text)
        return HttpResponse(html, content_type="text/html")
    except FileNotFoundError:
        raise Http404("Document not found")


@extend_schema(
    summary="List all documentation files",
    description="Returns a list of all Markdown files in the documentation directory.",
    request=None,
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            response=DocumentationSerializer,
            description="List of all Markdown files in the documentation directory.",
            examples=[
                OpenApiExample(
                    name="ExampleDocumentList",
                    description="A list of Markdown files in the documentation directory.",
                    value=["example.md", "tutorial.md", "settings.md"],
                )
            ],
        ),
    },
    tags=["Documentation"],
)
@api_view(["GET"])
def list_docs(request):
    docs_path = os.path.join(settings.BASE_DIR, "docs")
    print(settings.BASE_DIR)
    print(docs_path)
    markdown_files = [f for f in os.listdir(docs_path) if f.endswith(".md")]
    return Response(markdown_files)
