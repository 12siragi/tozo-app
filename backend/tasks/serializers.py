from rest_framework import serializers
from .models import Task
from django.utils.timezone import now  # Use Django's timezone utility for timezone-aware datetime

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'deadline', 
            'category', 'is_completed', 'created_at', 'updated_at', 'is_deleted', 'owner'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']

    def validate_deadline(self, value):
        current_time = now()
        if value < current_time:
            raise serializers.ValidationError(f"Deadline must be in the future. Current time is {current_time}.")
        return value

