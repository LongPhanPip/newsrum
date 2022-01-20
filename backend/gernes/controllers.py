from .models import Gerne
from django.db.models import Q


def get_gerne_by_id(pk):
    try:
        return Gerne.objects.get(pk=pk)
    except Gerne.DoesNotExist:
        raise exceptions.NotFound('Gerne does not exist')


def get_all_gernes():
    return Gerne.objects.all()


def search_gerne(filter):
    gernes = get_all_gernes()
    if filter.get('keyword', ""):
        keyword = filter['keyword'].lower()
        gernes = gernes.filter(Q(name__icontains=keyword) |
                               Q(description__icontains=keyword))

    return gernes


def delete_gerne_by_id(pk):
    get_gerne_by_id(pk).delete()
