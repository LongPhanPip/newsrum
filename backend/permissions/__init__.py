from rest_framework import permissions

import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']


class IsAccountOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True
        return False


class IsPostOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True
        return False


class IsCommentOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.method in SAFE_METHODS or (request.user and request.user.is_authenticated))

    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True
        return False


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.method in SAFE_METHODS or (request.user and request.user.is_authenticated))


class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.method in SAFE_METHODS or (request.user and request.user.is_staff))


class ReadOrPostOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True
        return False
