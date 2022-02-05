from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from paginations import PaginationHandlerMixin, Pagination

from .serializers import RecSysSerializer

from .train import train_model
from .controls import RecommenderControl


class RecommenderListView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    control = RecommenderControl()

    def get(self, request):
        recommenders = self.control.get_all_recommender()
        serializer = RecSysSerializer(recommenders, many=True)
        page = self.paginate_queryset(recommenders)

        if page is not None:
            serializer = self.get_paginated_response(RecSysSerializer(page, many=True).data)

        return Response(serializer.data)

    def post(self, request):
        serializer = RecSysSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RecommenderDetailView(APIView):
    control = RecommenderControl()

    def delete(self, request, pk):
        self.control.delete_rec_by_id(pk)
        return Response('Recommender was deleted successfully')


class RecommenderUseView(APIView):
    control = RecommenderControl()

    def post(self, request, pk):
        self.control.change_used_model(pk)
        return Response('ok')
