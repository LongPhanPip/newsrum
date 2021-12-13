from rest_framework import permissions

import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


class IsAccountOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True
        return False
