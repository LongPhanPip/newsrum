from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from permissions import IsAdminUserOrReadOnly
from posts.serializers import WebPostSerializer

from .serializers import PublisherSerializer, FeedSerializer
from .controls import PublisherControl, FeedControl


class PublisherListView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]
    control = PublisherControl()

    def get(self, request):
        publishers = self.control.get_all_publishers()
        serializer = PublisherSerializer(publishers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PublisherSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PublisherSearchView(APIView):
    permission_classes = [IsAdminUser]
    control = PublisherControl()

    def get(self, request):
        publishers = self.control.search_publisher(request.query_params.dict())
        serializer = PublisherSerializer(publishers, many=True)
        return Response(serializer.data)


class PublisherDetailView(APIView):
    permission_classes = [IsAdminUserOrReadOnly]
    control = PublisherControl()

    def get(self, request, pk):
        publisher = self.control.get_publisher_by_id(pk)
        serializer = PublisherSerializer(publisher)
        return Response(serializer.data)

    def put(self, request, pk):
        publisher = self.control.get_publisher_by_id(pk)
        serializer = PublisherSerializer(publisher, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.control.delete_publisher_by_id(pk)
        return Response('Publisher was deleted successfully')


class FeedListView(APIView):
    permission_classes = [IsAdminUser]
    control = FeedControl()

    def get(self, request, pk):
        feeds = self.control.get_feeds_by_publisher_id(pk)
        serializer = FeedSerializer(feeds, many=True)
        return Response(serializer.data)


    def post(self, request, pk):
        serializer = FeedSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FeedDetailView(APIView):
    permission_classes = [IsAdminUser]
    control = FeedControl()

    def put(self, request, pk):
        feed = self.control.get_feed_by_id(pk)
        serializer = FeedSerializer(feed, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        delete_feed_by_id(pk)
        return Response('Delete feed successful')


class PostListView(APIView):
    permission_classes = [IsAdminUser]
    control = FeedControl()

    def get(self, request, pk):
        feed = self.control.get_feed_by_id(pk)
        posts = self.control.get_posts_by_feed(feed)
        serializer = WebPostSerializer(posts, many=True)
        return Response(serializer.data)
