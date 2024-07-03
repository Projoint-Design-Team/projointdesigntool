from rest_framework import serializers

from .models import Documentation


class DocumentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documentation
        fields = ["identifier", "markdown_file"]
