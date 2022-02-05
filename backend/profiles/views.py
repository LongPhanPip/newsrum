import os
import mimetypes
import sys
from datetime import datetime

from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser

from accounts.controls import AccountControl

from .controls import ProfileControl
from .serializers import ProfileSerializer

from newsrum import settings

import logging
logger = logging.getLogger('__name__')


class ProfileDetailView(APIView):
    permission_classes = [IsAdminUser]
    control = ProfileControl()

    def get(self, request, pk):
        person_info = self.control.get_profile_by_id(pk)
        serializer = ProfileSerializer(person_info)
        return Response(serializer.data)


    def put(self, request, pk):
        return Response(self.control.update_profile_by_id(pk, request.data).data)


@api_view(['GET', ])
def get_avatar(request, pk):
    account_ctl = AccountControl()
    profile_ctl = ProfileControl()
    account = account_ctl.get_account_by_id(pk)
    person_info = profile_ctl.get_profile_by_account(account)
    filepath = os.path.join(settings.BASE_DIR, person_info.avatar.path)
    if os.path.exists(filepath):
        filename = os.path.basename(filepath)
        mimetype = mimetypes.guess_type(filepath)
        with open(filepath, 'rb') as f:
            response = HttpResponse(f.read(), content_type=mimetype[0])
            # response['Content-Disposition'] = f'inline; filename="{filename}"'
            response['Cache-Control'] = "max-age=0"
            return response
    else:
        return Response({'File not found'}, status=status.HTTP_404_NOT_FOUND)
