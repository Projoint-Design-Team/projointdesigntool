from django.urls import path

from .views import (
    export_csv,
    export_js,
    export_json,
    export_qsf,
    import_json,
    import_qsf,
    preview_survey,
)

app_name = "surveys"

urlpatterns = [
    path("export_js/", export_js, name="export_js"),
    path("export_json/", export_json, name="export_json"),
    path("import_json/", import_json, name="import_json"),
    path("preview_survey/", preview_survey, name="preview_survey"),
    path("export_csv/", export_csv, name="export_csv"),
    path("export_qsf/", export_qsf, name="export_qsf"),
    path("import_qsf/", import_qsf, name="import_qsf"),
]
