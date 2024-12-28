from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Task
from .serializers import (
    TaskSerializer,
    TaskDetailSerializer,
    TaskCreateUpdateSerializer,
    TaskSoftDeleteSerializer
)


class TaskListCreateView(generics.ListCreateAPIView):
    """
    List all tasks or create a new task.
    """
    queryset = Task.objects.filter(is_deleted=False)  # Exclude soft-deleted tasks
    permission_classes = [IsAuthenticated]  # Only authenticated users can create tasks
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TaskCreateUpdateSerializer  # Use a different serializer for POST requests
        return TaskSerializer


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific task.
    """
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]  # Only authenticated users can view, update, or delete tasks

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TaskCreateUpdateSerializer  # Use the same serializer for update requests
        return TaskDetailSerializer  # Default serializer for GET requests

    def perform_destroy(self, instance):
        """
        Override the default delete behavior to implement soft delete.
        """
        instance.is_deleted = True
        instance.save()


class TaskSoftDeleteView(generics.UpdateAPIView):
    """
    Update the is_deleted field to implement soft delete.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSoftDeleteSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can perform soft delete


class TaskCompletedListView(generics.ListAPIView):
    """
    List all completed tasks.
    """
    queryset = Task.objects.filter(is_completed=True, is_deleted=False)  # Only non-deleted completed tasks
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]  # Publicly accessible, anyone can view completed tasks
