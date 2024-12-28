from rest_framework import serializers
from .models import Task
from django.utils import timezone


class TaskSerializer(serializers.ModelSerializer):
    """
    Basic Serializer for Task Model. Suitable for listing tasks and basic operations.
    """
    owner_username = serializers.ReadOnlyField(source='owner.username')  # Read-only field for owner's username

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'priority',
            'deadline',
            'category',
            'is_completed',
            'owner',
            'owner_username',
            'created_at',
            'updated_at',
            'is_deleted',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']


class TaskDetailSerializer(serializers.ModelSerializer):
    """
    Detailed Serializer for Task Model. Includes all fields and human-readable owner representation.
    """
    owner = serializers.StringRelatedField()  # Returns the owner's string representation (username)

    class Meta:
        model = Task
        fields = '__all__'  # Includes all fields
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']


class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating tasks with custom validations and behavior.
    """
    class Meta:
        model = Task
        fields = [
            'title',
            'description',
            'priority',
            'deadline',
            'category',
            'is_completed',
        ]

    def validate_deadline(self, value):
        """
        Ensure the deadline is not in the past.
        """
        if value < timezone.now():
            raise serializers.ValidationError("The deadline cannot be in the past.")
        return value

    def create(self, validated_data):
        """
        Custom create method to handle ownership.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['owner'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Custom update method if you want to add extra logic.
        """
        return super().update(instance, validated_data)


class TaskSoftDeleteSerializer(serializers.ModelSerializer):
    """
    Serializer for managing soft delete by updating the is_deleted field.
    """
    class Meta:
        model = Task
        fields = ['is_deleted']
