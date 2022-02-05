import os
import django
import time
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myapp.settings")
django.setup()

from posts.models import Post
from accounts.models import Account
from datetime import datetime, date
from collections import defaultdict
import numpy as np
import pandas as pd

ACTIVE_PERCENT = 0.4
ACTIVE_NUMBER = 150
INACTIVE_NUMBER = 20

gerne = {
    'thoisu': 1,
    'chinhtri': 2,
    'kinhte': 3,
    'xahoi': 4,
    'thethao': 5,
    'phapluat': 6,
    'khoahoc': 7,
    'giaitri': 8,
    'giaoduc': 9,
    'tamsu': 10,
}

GERNE_GREATER_30 = ['thoisu', 'chinhtri', 'kinhte', 'xahoi', 'giaoduc', 'phapluat']
GERNE_LESSER_30 = ['thethao', 'giaitri', 'tamsu', 'khoahoc']
PREFER_PROP = 0.2


all_user = Account.objects.filter(is_admin=False)
all_post = Post.objects.all()

gerne_to_post = defaultdict(list)

for post in all_post:
    gerne_to_post[post.gerne_id].append(post.pk.hex)


def to_age(date_of_birth):
    now = date.today()
    delta = now - date_of_birth
    return np.floor(delta.days / 356).astype(int)


records = []
for user in all_user:
    record = (user.pk.hex, to_age(user.profile.date_of_birth), 1 if user.profile.gender == 'M' else 0)
    records.append(record)

user_df = pd.DataFrame(records, columns=['id', 'age', 'gender'])

sql_query = 'insert into post_click(account_id, post_id, created_at, is_recommended) values'
first = True
for index, user in user_df.iterrows():
    is_active = np.random.binomial(1, ACTIVE_PERCENT)
    if is_active:
        num_interact = np.floor(np.random.normal(ACTIVE_NUMBER, 50)).astype(int)
    else:
        num_interact = np.floor(np.random.normal(INACTIVE_NUMBER, 5)).astype(int)
    age = user['age']
    gender = user['gender']
    prefer = np.random.choice(GERNE_GREATER_30 if age > 30 else GERNE_LESSER_30)
    prefer_gerne = gerne[prefer]
    prop = [(1 - PREFER_PROP) / 9] * 10
    prop[prefer_gerne - 1] = PREFER_PROP
    for _ in range(num_interact):
        gerne_view = np.random.choice(list(range(1, 11)), p=prop)
        posts = gerne_to_post[gerne_view]
        index = np.random.choice(len(posts))
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        if first:
            sql_query += f"('{user['id']}', '{posts[index]}', '{now}', '0')"
            first = False
        else:
            sql_query += f", ('{user['id']}', '{posts[index]}', '{now}', '0')"

        time.sleep(0.01)

with open('click.sql', 'w') as f:
    f.write(sql_query)
