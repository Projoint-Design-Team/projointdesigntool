from django.core.validators import MinValueValidator
from django.db import models


class Survey(models.Model):
    attributes = models.JSONField()
    restrictions = models.JSONField(blank=True, default=list)
    filename = models.CharField(max_length=255, default="survey.js")
    cross_restrictions = models.JSONField(blank=True, default=list)
    num_profiles = models.IntegerField(validators=[MinValueValidator(2)], default=2)
    filename = models.CharField(max_length=255, default="survey.js")
    csv_lines = models.IntegerField(default=500)
    num_tasks = models.IntegerField(validators=[MinValueValidator(1)], default=5)
    repeated_tasks = models.BooleanField(default=False)
    repeated_tasks_flipped = models.BooleanField(default=False)
    task_to_repeat = models.IntegerField(
        validators=[MinValueValidator(0)], null=True, blank=True
    )
    where_to_repeat = models.IntegerField(
        validators=[MinValueValidator(0)], null=True, blank=True
    )
    random = models.BooleanField(default=False)
    randomize = models.BooleanField(default=False)

    advanced = models.JSONField(blank=True, default=dict)  # QUALTRICS LOGIC
