from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer

# Create Task
class TaskCreateView(generics.CreateAPIView):
    """
    Handles creating a new task.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the task to the currently logged-in user
        serializer.save(owner=self.request.user)


# List Tasks
class TaskListView(generics.ListAPIView):
    """
    Handles listing all tasks for the authenticated user.
    Includes filtering, searching, and ordering.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['priority', 'category', 'is_completed']
    ordering_fields = ['deadline', 'priority']
    search_fields = ['title', 'description']

    def get_queryset(self):
        # Return only the authenticated user's tasks that are not soft-deleted
        return Task.objects.filter(owner=self.request.user, is_deleted=False)


# Retrieve, Update, Delete Task
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles retrieving, updating, or deleting a specific task.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return only the authenticated user's tasks that are not soft-deleted
        return Task.objects.filter(owner=self.request.user, is_deleted=False)

    def perform_destroy(self, instance):
        # Perform a soft delete by setting `is_deleted` to True
        instance.is_deleted = True
        instance.save()


# Mark Task as Complete
class MarkTaskCompleteView(APIView):
    """
    Custom view to mark a task as completed.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            # Find the task for the authenticated user that is not soft-deleted
            task = Task.objects.get(pk=pk, owner=request.user, is_deleted=False)
            if task.is_completed:
                return Response({'message': 'Task is already completed!'})
            task.is_completed = True
            task.save()
            return Response({'message': 'Task marked as completed!'})
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=404)
