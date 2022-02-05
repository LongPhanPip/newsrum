import requests
from datetime import datetime
import pytz
from bs4 import BeautifulSoup as bs
from rest_framework import exceptions
from django.db.models import Q
from posts.models import Post, WebPost

from .models import Publisher, Feed
import logging

logger = logging.getLogger('__name__')

web_headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}


def extract_text(string):
    return bs(string, 'lxml').get_text()


def extract_image(url):
    url = url.strip()
    r = requests.get(url, headers=web_headers)
    if(r.status_code != 200):
        r = requests.get(url)
    soup = bs(r.content, 'lxml')
    return soup.find('meta', attrs={'property': 'og:image'})['content']

class PublisherControl():

    def get_all_publishers(self):
        return Publisher.objects.all()


    def search_publisher(self, filter):
        publishers = self.get_all_publishers()
        if filter.get('keyword', ''):
            keyword = filter['keyword'].lower().strip()
            publishers = publishers.filter(Q(name__icontains=keyword) |
                                           Q(url__icontains=keyword))

        return publishers


    def get_publisher_by_id(self, pk):
        try:
            return Publisher.objects.get(pk=pk)
        except:
            raise exceptions.NotFound('Publisher does not exist')


    def delete_publisher_by_id(self, pk):
        self.get_publisher_by_id(pk).delete()


class FeedControl():
    def get_posts_by_feed(self, feed):
        web_posts = []
        r = requests.get(feed.url, headers=web_headers)
        soup = bs(r.content, 'lxml-xml')
        items = soup.find_all('item')
        gerne_id = feed.gerne_id
        for item in items:
            title = item.title.get_text()
            description = extract_text(item.description.get_text())
            links = item.find_all('link')
            for link in links:
                if link.attrs.get('href', ''):
                    url = link.attrs['href']
                    break
                else:
                    url = link.get_text()
                    break
            image = extract_image(url)
            timezone = pytz.timezone("Asia/Ho_Chi_Minh")
            try:
                time = ' '.join(item.pubDate.get_text().split(' ')[:-1])
                created_at = datetime.strptime(time, '%a, %d %b %Y %H:%M:%S')
            except Exception:
                created_at = datetime.strptime(item.pubDate.get_text(), '%m/%d/%Y %H:%M:%S')

            with_timezone = timezone.localize(created_at)
            post = Post(title=title, description=description, gerne_id=gerne_id, created_at=with_timezone, status="A")
            web_post = WebPost(post=post, url=url, publisher_id=feed.publisher_id, image_url=image)
            # post.save()
            # web_post.save()
            web_posts.append(web_post)
        return web_posts


    def get_feeds_by_publisher_id(self, pk):
        return Feed.objects.filter(publisher_id=pk)


    def get_feed_by_id(self, pk):
        try:
            return Feed.objects.get(pk=pk)
        except:
            raise exceptions.NotFound('Feed does not exist')


    def delete_feed_by_id(self, pk):
        return self.get_feed_by_id(pk).delete()
