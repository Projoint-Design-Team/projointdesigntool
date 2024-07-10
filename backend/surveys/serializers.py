from rest_framework import serializers

from .models import Survey


class LevelSerializer(serializers.Serializer):
    name = serializers.CharField()
    weight = serializers.FloatField(default=1.0)


class AttributeSerializer(serializers.Serializer):
    name = serializers.CharField()
    levels = LevelSerializer(many=True)
    locked = serializers.BooleanField(default=False)


class SimpleSerializer(serializers.Serializer):
    attribute = serializers.CharField()
    operation = serializers.CharField()
    value = serializers.CharField()


class LogicalSerializer(SimpleSerializer):
    logical = serializers.CharField(required=False)


class RestrictionSerializer(serializers.Serializer):
    condition = LogicalSerializer(many=True)
    result = SimpleSerializer(many=True)


class CrossRestrictionSerializer(serializers.Serializer):
    condition = SimpleSerializer()
    result = SimpleSerializer()


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()


class ShortSurveySerializer(serializers.ModelSerializer):
    attributes = AttributeSerializer(many=True, required=True)
    restrictions = RestrictionSerializer(many=True, required=False, default=list)
    cross_restrictions = CrossRestrictionSerializer(
        many=True, required=False, default=list
    )
    num_profiles = serializers.IntegerField(default=2, min_value=2)
    filename = serializers.CharField(required=True)
    csv_lines = serializers.IntegerField(default=500)

    class Meta:
        model = Survey
        fields = [
            "attributes",
            "restrictions",
            "cross_restrictions",
            "num_profiles",
            "filename",
            "csv_lines",
        ]

    def validate_attributes(self, value):
        """
        Check that attributes is a list of dicts with required keys 'name' and 'levels'.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("Attributes must be a list.")

        if any(not attribute["levels"] for attribute in value):
            raise serializers.ValidationError(
                "Cannot export. Some attributes have no levels."
            )

        for item in value:
            if not isinstance(item, dict) or "name" not in item or "levels" not in item:
                raise serializers.ValidationError(
                    "Each attribute must be a dict with 'name' and 'levels'."
                )

        return value

    def validate(self, data):
        """
        Custom validation that checks each restriction for logic errors or inconsistencies.
        """
        restrictions = data["restrictions"]
        for restriction in restrictions:
            if "logical" in restriction["condition"] and cond["logical"] not in [
                "||",
                "&&",
            ]:
                raise serializers.ValidationError("Invalid operation in logical.")
            for cond in restriction["condition"]:
                if cond["operation"] not in ["==", "!="]:
                    raise serializers.ValidationError("Invalid operation in condition.")
            for res in restriction["result"]:
                if res["operation"] not in ["==", "!="]:
                    raise serializers.ValidationError("Invalid operation in result.")
        return data


class SurveySerializer(ShortSurveySerializer):
    num_tasks = serializers.IntegerField(default=5, min_value=1, allow_null=True)
    repeated_tasks = serializers.BooleanField(default=False, allow_null=True)
    repeated_tasks_flipped = serializers.BooleanField(default=False, allow_null=True)
    task_to_repeat = serializers.IntegerField(default=0, min_value=0, allow_null=True)
    where_to_repeat = serializers.IntegerField(default=4, min_value=0, allow_null=True)
    random = serializers.BooleanField(default=False, allow_null=True)
    randomize = serializers.BooleanField(default=False, allow_null=True)

    class Meta(ShortSurveySerializer.Meta):
        fields = ShortSurveySerializer.Meta.fields + [
            "num_tasks",
            "repeated_tasks",
            "repeated_tasks_flipped",
            "task_to_repeat",
            "where_to_repeat",
            "random",
            "randomize",
        ]


class ExtraSurveySerializer(SurveySerializer):
    doubleQ = serializers.BooleanField(default=False)
    qDescription = serializers.CharField(
        default="Enter your description here! Here are two profiles A and B."
    )
    qText = serializers.CharField(
        default="Please carefully review the options detailed below, \
            then please answer the questions. Which of these choices do you prefer?"
    )
    qType = serializers.CharField(default="MC")

    class Meta(SurveySerializer.Meta):
        fields = SurveySerializer.Meta.fields + [
            "qDescription",
            "doubleQ",
            "qType",
            "qText",
        ]
