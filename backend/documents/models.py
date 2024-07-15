import os

from django.conf import settings
from django.db import models


class Documentation(models.Model):
    identifier = models.CharField(max_length=100, unique=True)
    markdown_file = models.FilePathField(
        path=os.path.join(settings.BASE_DIR, "content")
    )
