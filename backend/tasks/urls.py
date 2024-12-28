from django.urls import path
from .views import (
    TaskListCreateView,
    TaskDetailView,
    TaskSoftDeleteView,
    TaskCompletedListView,
)

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/soft-delete/', TaskSoftDeleteView.as_view(), name='task-soft-delete'),
    path('tasks/completed/', TaskCompletedListView.as_view(), name='task-completed-list'),
]
