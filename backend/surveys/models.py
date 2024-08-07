from django.core.validators import MinValueValidator
from django.db import models


class Survey(models.Model):
    attributes = models.JSONField()
    restrictions = models.JSONField(blank=True, default=list)
    cross_restrictions = models.JSONField(blank=True, default=list)
    num_profiles = models.IntegerField(validators=[MinValueValidator(2)], default=2)
    filename = models.CharField(max_length=255)
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
    fixed_profile = models.JSONField(default=dict)
    fixed_profile_position = models.IntegerField(default=0)
    profile_naming = models.CharField(max_length=255, default="Profile")
