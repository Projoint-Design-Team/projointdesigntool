import json
import os

from dotenv import load_dotenv
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .helpers import (
    _create_js_file,
    _create_profiles,
    _create_qualtrics_js_text,
    _create_survey,
    _download_survey,
    _filter_survey_data,
    _generate_unlocked_order,
    _populate_csv,
    _send_file_response,
    _validate_file,
    _validate_survey_data,
)
from .serializers import (
    FileUploadSerializer,
    ExtraSurveySerializer,
    ShortSurveySerializer,
    SurveySerializer,
)

load_dotenv()


@extend_schema(
    request=ExtraSurveySerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            response=SurveySerializer,
            description="A JavaScript file containing the survey data.",
            examples=[
                OpenApiExample(
                    name="JSFileExample",
                    description="A JavaScript file containing the survey data.",
                    value={
                        "content_type": "application/javascript",
                        "headers": {
                            "Content-Disposition": 'attachment; filename="survey_export.js"'
                        },
                    },
                )
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="An error response indicating that the request was invalid.",
        ),
    },
    description="Generates and returns a JavaScript file based on the provided survey data if valid.",
    summary="Export a survey to JavaScript",
    tags=["Export"],
)
@api_view(["POST"])
def export_js(request):
    return _send_file_response(_create_js_file(request))


@extend_schema(
    request=ShortSurveySerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            response=ShortSurveySerializer,
            description="Preview of survey generated",
            examples=[
                OpenApiExample(
                    name="SurveyPreviewSuccess",
                    description="A successful preview of survey answers.",
                    value={
                        "attributes": ["attribute1", "attribute2"],
                        "previews": [
                            ["profile1value1", "profile1value2"],
                            ["profile2value1", "profile2value2"],
                        ],
                    },
                )
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            response=ShortSurveySerializer,
            description="Bad Request, no survey data or invalid data provided",
            examples=[
                OpenApiExample(
                    name="SurveyPreviewFailEmpty",
                    description="The survey data provided is empty.",
                    value={"message": "Survey is empty."},
                ),
                OpenApiExample(
                    name="SurveyPreviewFailInvalid",
                    description="The survey data provided is invalid.",
                    value={"message": "Invalid survey data."},
                ),
            ],
        ),
    },
    description="Generates and returns a preview of the survey based on the provided survey data if valid.",
    summary="Preview a survey",
    tags=["Preview"],
)
@api_view(["POST"])
def preview_survey(request):
    serializer = ShortSurveySerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data

        attributes = validated_data["attributes"]
        restrictions = validated_data["restrictions"]
        cross_restrictions = validated_data["cross_restrictions"]
        num_profiles = validated_data["num_profiles"]
        fixed_profile = validated_data["fixed_profile"]
        fixed_profile_position = validated_data["fixed_profile_position"]

        attributes_list = _generate_unlocked_order(attributes)
        answer = {"attributes": [], "previews": []}
        answer["previews"] = _create_profiles(
            num_profiles, attributes_list, restrictions, cross_restrictions
        )
        answer["attributes"] = [key for key in answer["previews"][0].keys()]

        # Sub fixed profile instead of first profile
        if fixed_profile:
            fixed_prof = {key: fixed_profile[key] for key in answer["attributes"]}
            answer["previews"][fixed_profile_position] = fixed_prof

        return Response(answer, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=400)


@extend_schema(
    request=FileUploadSerializer,
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            response=SurveySerializer,
            description="Validated survey data",
            examples=[
                OpenApiExample(
                    name="ValidatedSurveyData",
                    description="Validated Survey Data",
                    value=SurveySerializer().data,
                )
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="An error response indicating that the request was invalid.",
        ),
    },
    description="Imports a JSON file and validates it against the Survey model. Returns the validated data if successful.",
    summary="Import a JSON formatted survey",
    tags=["Import"],
)
@api_view(["POST"])
def import_json(request):
    data = _validate_file(request, "JSON", "application/json")
    if isinstance(data, Response):
        return data
    return _validate_survey_data(data)


@extend_schema(
    request=ExtraSurveySerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            response=ShortSurveySerializer,
            description="A JSON file containing the validated survey data.",
            examples=[
                OpenApiExample(
                    name="JSONFileExample",
                    description="A JSON file containing the validated survey data.",
                    value={
                        "content_type": "application/json",
                        "headers": {
                            "Content-Disposition": 'attachment; filename="survey_export.json"'
                        },
                    },
                ),
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            response=ShortSurveySerializer,
            description="Bad Request, no survey data or invalid data provided.",
            examples=[
                OpenApiExample(
                    name="SurveyExportFailEmpty",
                    description="The survey data provided is empty.",
                    value={"message": "Survey data is empty."},
                ),
                OpenApiExample(
                    name="SurveyExportFailInvalid",
                    description="The survey data provided is invalid.",
                    value={"message": "Invalid survey data."},
                ),
            ],
        ),
    },
    description="Exports the validated survey data to a JSON file.",
    summary="Export a survey to JSON",
    tags=["Export"],
)
@api_view(["POST"])
def export_json(request):
    serializer = ExtraSurveySerializer(data=request.data)
    if serializer.is_valid():
        filename = serializer.validated_data["filename"]
        with open(filename, "w", encoding="utf-8") as file:
            json.dump(request.data, file, ensure_ascii=False, indent=4)
        return _send_file_response(filename)
    else:
        return Response(serializer.errors, status=400)


@extend_schema(
    request=ShortSurveySerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            response=ShortSurveySerializer,
            description="A CSV file containing the preview of survey data.",
            examples=[
                OpenApiExample(
                    name="PreviewCSVFileExample",
                    description="A CSV file stream containing the preview of survey data of all possible combinations.",
                    value={
                        "content_type": "text/csv",
                        "headers": {
                            "Content-Disposition": 'attachment; filename="preview.csv"'
                        },
                    },
                ),
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            response=ShortSurveySerializer,
            description="Bad Request, no survey data or invalid data provided",
            examples=[
                OpenApiExample(
                    name="SurveyPreviewFailEmpty",
                    description="The survey data provided is empty.",
                    value={"message": "Survey is empty."},
                ),
                OpenApiExample(
                    name="SurveyPreviewFailInvalid",
                    description="The survey data provided is invalid.",
                    value={"message": "Invalid survey data."},
                ),
            ],
        ),
    },
    description="Generates and sends a CSV file of profile combinations based on provided attributes.",
    summary="Export a survey to CSV",
    tags=["Export"],
)
@api_view(["POST"])
def export_csv(request):
    serializer = ShortSurveySerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data

        attributes = validated_data["attributes"]
        restrictions = validated_data["restrictions"]
        cross_restrictions = validated_data["cross_restrictions"]
        num_profiles = validated_data["num_profiles"]
        csv_lines = validated_data["csv_lines"]
        filename = validated_data["filename"]
        fixed_profile = validated_data["fixed_profile"]
        fixed_profile_position = validated_data["fixed_profile_position"]

        _populate_csv(
            attributes,
            num_profiles,
            restrictions,
            cross_restrictions,
            csv_lines,
            filename,
            fixed_profile,
            fixed_profile_position,
        )
        return _send_file_response(filename)
    else:
        return Response(serializer.errors, status=400)


"""""" """""" """""" """""" """""" """""" """""" """
""" """""" """QUALTRICS LOGIC""" """""" """""" """
""" """""" """""" """""" """""" """""" """""" """"""


@extend_schema(
    request=ExtraSurveySerializer,
    responses={
        status.HTTP_201_CREATED: OpenApiResponse(
            response=ExtraSurveySerializer,
            description="A QSF file containing the survey data.",
            examples=[
                OpenApiExample(
                    name="CreateQualtricsExample",
                    description="Successful creation of Qualtrics survey and export of survey QSF",
                    value={
                        "content_type": "application/json",
                        "headers": {
                            "Content-Disposition": 'attachment; filename="{filename}"'
                        },
                    },
                )
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            response=SurveySerializer,
            description="Error in creating Qualtrics survey and exporting QSF file",
            examples=[
                OpenApiExample(
                    name="CreateQualtricsErrorExample",
                    description="This response is returned when request to create Qualtrics survey and export QSF file is invalid",
                    value={
                        "error": "Invalid data provided.",
                        "details": "Incomplete survey data",
                    },
                )
            ],
        ),
    },
    description="Generates and exports a Qualtrics survey based on the provided survey data if valid.",
    summary="Export a survey to Qualtrics",
    tags=["Export"],
)
@api_view(["POST"])
def export_qsf(request):
    serializer = ExtraSurveySerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        attributes = validated_data["attributes"]
        filename = validated_data["filename"]
        num_profiles = validated_data["num_profiles"]
        num_tasks = validated_data["num_tasks"]
        task_to_repeat = validated_data["task_to_repeat"]
        where_to_repeat = validated_data["where_to_repeat"]
        repeated_tasks_flipped = validated_data["repeated_tasks_flipped"]
        doubleQ = validated_data["doubleQ"]
        qType = validated_data["qType"]
        qInstruction = validated_data["qInstruction"]
        qDescription = validated_data["qDescription"]
        profile_naming = validated_data["profile_naming"]

        user_token = os.getenv("QUALTRICS_API_KEY")

        js_text = _create_qualtrics_js_text(request)
        surveyID = _create_survey(
            filename,
            user_token,
            max(num_tasks, where_to_repeat),
            len(attributes),
            num_profiles,
            "",
            js_text,
            task_to_repeat,
            where_to_repeat,
            repeated_tasks_flipped,
            doubleQ,
            qInstruction,
            qDescription,
            profile_naming,
        )
        success = _download_survey(surveyID, user_token, doubleQ, qType, filename)
        if success:
            return _send_file_response(filename)
        else:
            return Response(
                {"error": "Failed to download survey."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=FileUploadSerializer,
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            response=SurveySerializer,
            description="Reversing QSF File into Survey",
            examples=[
                OpenApiExample(
                    name="ReverseQualtricsExample",
                    description="Successful Reversing QSF File into Survey",
                    value=SurveySerializer().data,
                )
            ],
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="Error in Reversing QSF File into Survey",
        ),
    },
    description="Imports a QSF file into an attribute JSON.",
    summary="Imports QSF File",
    tags=["Import"],
)
@api_view(["POST"])
def import_qsf(request):
    data = _validate_file(request, "QSF", "multipart/form-data")
    if isinstance(data, Response):
        return data

    survey_data = _filter_survey_data(data)
    if isinstance(survey_data, Response):
        return survey_data
    return _validate_survey_data(survey_data)
