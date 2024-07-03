from django.urls import path

from .views import get_doc, list_docs

urlpatterns = [
    path("docs/list/", list_docs, name="list_docs"),
    path("docs/<str:identifier>/", get_doc, name="get_doc"),
]
