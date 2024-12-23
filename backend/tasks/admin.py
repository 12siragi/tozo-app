from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'deadline', 'category', 'is_completed', 'owner', 'created_at', 'updated_at')
    list_filter = ('priority', 'category', 'is_completed', 'owner', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'owner__username')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_editable = ('is_completed',)
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'priority', 'deadline', 'category', 'owner', 'is_completed', 'is_deleted')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
