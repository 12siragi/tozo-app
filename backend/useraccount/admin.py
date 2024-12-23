from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser

class CustomUserAdmin(BaseUserAdmin):
    # Fields to display in the admin panel
    list_display = ('email', 'username', 'is_verified', 'is_active', 'is_staff', 'is_admin')
    list_filter = ('is_staff', 'is_admin', 'is_active', 'is_verified')
    
    # Fields to display on the user detail page in the admin
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('username',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_admin', 'is_superuser', 'is_verified')}),
        (_('Important Dates'), {'fields': ('last_login',)}),
    )
    
    # Fields to display when adding a new user in the admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ()

# Register the custom user model with the custom admin
admin.site.register(CustomUser, CustomUserAdmin)
