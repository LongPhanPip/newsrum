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
    r = requests.get(url, headers=web_headers)
    soup = bs(r.content)
    return soup.find('meta', attrs={'property': 'og:image'})['content']


def get_all_publishers():
    return Publisher.objects.all()


def search_publisher(filter):
    publishers = get_all_publishers()
    if filter.get('keyword', ''):
        keyword = filter['keyword'].lower().strip()
        publishers = publishers.filter(Q(name__icontains=keyword) |
                                       Q(url__icontains=keyword))

    return publishers


def get_publisher_by_id(pk):
    try:
        return Publisher.objects.get(pk=pk)
    except:
        raise exceptions.NotFound('Publisher does not exist')


def get_posts_by_feed(feed):
    web_posts = []
    r = requests.get(feed.url, headers=web_headers)
    soup = bs(r.content, 'lxml-xml')
    items = soup.find_all('item')
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
        time = ' '.join(item.pubDate.get_text().split(' ')[:-1])
        timezone = pytz.timezone("Asia/Ho_Chi_Minh")
        created_at = datetime.strptime(time, '%a, %d %b %Y %H:%M:%S')
        with_timezone = timezone.localize(created_at)
        post = Post(title=title, description=description, gerne_id=0, created_at=with_timezone, status="H")
        web_post = WebPost(post=post, url=url, publisher_id=feed.publisher_id, image_url=image)
        web_posts.append(web_post)
    return web_posts


def get_feeds_by_publisher_id(pk):
    return Feed.objects.filter(publisher_id=pk)


def get_feed_by_id(pk):
    try:
        return Feed.objects.get(pk=pk)
    except:
        raise exceptions.NotFound('Feed does not exist')


def delete_feed_by_id(pk):
    return get_feed_by_id(pk).delete()


def delete_publisher_by_id(pk):
    get_publisher_by_id(pk).delete()
