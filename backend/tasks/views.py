from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Task
from .serializers import (
    TaskSerializer,
    TaskCreateUpdateSerializer,
    TaskDetailSerializer,
    TaskSoftDeleteSerializer,
)

class TaskListCreateView(generics.ListCreateAPIView):
    """
    List all tasks for the authenticated user or create a new task.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter tasks by the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=False)

    def get_serializer_class(self):
        """
        Use different serializers for GET and POST requests.
        """
        if self.request.method == 'POST':
            return TaskCreateUpdateSerializer
        return TaskSerializer


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or soft delete a specific task for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter tasks by the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=False)

    def get_serializer_class(self):
        """
        Use different serializers for GET and update requests.
        """
        if self.request.method in ['PUT', 'PATCH']:
            return TaskCreateUpdateSerializer
        return TaskDetailSerializer

    def perform_destroy(self, instance):
        """
        Override the default delete behavior to implement soft delete.
        """
        instance.is_deleted = True
        instance.save()


class MarkTaskCompleteView(generics.UpdateAPIView):
    """
    Mark a specific task as completed for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Filter tasks by the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=False)

    def perform_update(self, serializer):
        """
        Mark the task as completed.
        """
        task = serializer.instance
        task.is_completed = True
        task.save()


class TaskSoftDeleteView(generics.UpdateAPIView):
    """
    Soft delete a specific task for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSoftDeleteSerializer

    def get_queryset(self):
        """
        Filter tasks by the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=False)

    def perform_update(self, serializer):
        """
        Perform soft delete (set `is_deleted` to True).
        """
        task = serializer.instance
        task.is_deleted = True
        task.save()


class TaskCompletedListView(generics.ListAPIView):
    """
    List all completed tasks for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Filter completed tasks for the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_completed=True, is_deleted=False)


class TaskArchiveListView(generics.ListAPIView):
    """
    List all archived (soft-deleted) tasks for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        """
        Filter archived tasks for the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=True)


class TaskRestoreView(generics.UpdateAPIView):
    """
    Restore a soft-deleted task for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSoftDeleteSerializer

    def get_queryset(self):
        """
        Filter archived tasks for the authenticated user.
        """
        return Task.objects.filter(owner=self.request.user, is_deleted=True)

    def update(self, request, *args, **kwargs):
        """
        Restore a soft-deleted task.
        """
        task = self.get_object()
        if task.is_deleted:
            task.is_deleted = False
            task.save()
            return Response({"message": "Task restored successfully!"}, status=status.HTTP_200_OK)
        return Response({"message": "Task is not archived!"}, status=status.HTTP_400_BAD_REQUEST)
