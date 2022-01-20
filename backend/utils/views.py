from rest_framework.views import APIView
from rest_framework.response import Response

import requests
import logging

logger = logging.getLogger('__name__')

class GetWebDataView(APIView):
    def get(self, request):
        url = request.data.get('url', '')
        return Response({'hoho' : 'a'})
