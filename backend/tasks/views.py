from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer, TaskCreateUpdateSerializer, TaskDetailSerializer, TaskSoftDeleteSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    """
    List all tasks for the authenticated user or create a new task.
    """
    permission_classes = [IsAuthenticated]  # Only authenticated users can create tasks
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Override to filter tasks by the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=False)  # Filter by logged-in user

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TaskCreateUpdateSerializer  # Use a different serializer for POST requests
        return TaskSerializer


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific task for the authenticated user.
    """
    permission_classes = [IsAuthenticated]  # Only authenticated users can view, update, or delete tasks

    def get_queryset(self):
        """
        Override to filter tasks by the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=False)  # Filter by logged-in user

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
    List all completed tasks for the authenticated user.
    """
    permission_classes = [IsAuthenticated]  # Only authenticated users can view their completed tasks
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Filter completed tasks for the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_completed=True, is_deleted=False)
