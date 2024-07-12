from django.urls import path

from .views import get_doc, list_docs

urlpatterns = [
    path("documents/list/", list_docs, name="list_docs"),
    path("documents/<str:identifier>/", get_doc, name="get_doc"),
]
