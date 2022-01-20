from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .controllers import get_all_gernes, get_gerne_by_id, delete_gerne_by_id, search_gerne
from .serializers import GerneSerializer
from permissions import IsAdminUserOrReadOnly


class GerneListView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]

    def get(self, request):
        gernes = get_all_gernes()
        serializer = GerneSerializer(gernes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GerneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GerneSearchView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]

    def get(self, request):
        gernes = search_gerne(request.query_params.dict())
        serializer = GerneSerializer(gernes, many=True)
        return Response(serializer.data)


class GerneDetailView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]

    def get(self, request, pk):
        gerne = get_gerne_by_id(pk)
        serializer = GerneSerializer(gerne)
        return Response(serializer.data)

    def put(self, request, pk):
        gerne = get_gerne_by_id(pk)
        serializer = GerneSerializer(gerne, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        delete_gerne_by_id(pk)
        return Response('Gerne was deleted successfully')
