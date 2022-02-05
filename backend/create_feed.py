import requests
import json
import numpy as np
from datetime import datetime

API_URL = 'http://localhost:8000/api/v1/'

LOGIN_PATH = 'login'
REGISTER_PATH = 'register'
FEED_PATH = 'publishers/feeds/'


USERNAME = 'admin'
PASSWORD = '123456'


def login():
    r = requests.post(API_URL + LOGIN_PATH, data={'username': USERNAME, 'password': PASSWORD})
    res = json.loads(r.content)
    return res['access']


# key = login()

# auth_header = {'Authorization': f'Bearer {key}'}


publisher = {
    'vnexpress': 1,
    'dantri': 2,
    'vietnamnet': 3,
    'thanhnien': 4,
    'tuoitre': 5,
    'zing': 6,
    'vtv': 7,
    'genk': 8,
    'phapluat': 9,
    'laodong': 11,
    'nld': 14
}

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

list_feed = [
    ('https://vnexpress.net/rss/thoi-su.rss', publisher['vnexpress'], gerne['thoisu']),
    ('https://vnexpress.net/rss/giai-tri.rss', publisher['vnexpress'], gerne['giaitri']),
    ('https://vnexpress.net/rss/the-thao.rss', publisher['vnexpress'], gerne['thethao']),
    ('https://vnexpress.net/rss/phap-luat.rss', publisher['vnexpress'], gerne['phapluat']),
    ('https://vnexpress.net/rss/giao-duc.rss', publisher['vnexpress'], gerne['giaoduc']),
    ('https://vnexpress.net/rss/khoa-hoc.rss', publisher['vnexpress'], gerne['khoahoc']),
    ('https://vnexpress.net/rss/tam-su.rss', publisher['vnexpress'], gerne['tamsu']),
    ('https://vnexpress.net/rss/the-gioi.rss', publisher['vnexpress'], gerne['chinhtri']),
    ('https://vnexpress.net/rss/kinh-doanh.rss', publisher['vnexpress'], gerne['kinhte']),

    ('https://vietnamnet.vn/rss/thoi-su-chinh-tri.rss', publisher['vietnamnet'], gerne['chinhtri']),
    ('https://vietnamnet.vn/rss/thoi-su.rss', publisher['vietnamnet'], gerne['thoisu']),
    ('https://vietnamnet.vn/rss/kinh-doanh.rss', publisher['vietnamnet'], gerne['kinhte']),
    ('https://vietnamnet.vn/rss/giai-tri.rss', publisher['vietnamnet'], gerne['giaitri']),
    ('https://vietnamnet.vn/rss/giao-duc.rss', publisher['vietnamnet'], gerne['giaoduc']),
    ('https://vietnamnet.vn/rss/cong-nghe.rss', publisher['vietnamnet'], gerne['khoahoc']),
    ('https://vietnamnet.vn/rss/talkshow.rss', publisher['vietnamnet'], gerne['tamsu']),
    ('https://vietnamnet.vn/rss/phap-luat.rss', publisher['vietnamnet'], gerne['phapluat']),
    ('https://vietnamnet.vn/rss/the-thao.rss', publisher['vietnamnet'], gerne['thethao']),
    ('https://vietnamnet.vn/rss/doi-song.rss', publisher['vietnamnet'], gerne['xahoi']),

    ('https://thanhnien.vn/rss/thoi-su/chinh-tri-227.rss', publisher['thanhnien'], gerne['chinhtri']),
    ('https://thanhnien.vn/rss/video/thoi-su-333.rss', publisher['thanhnien'], gerne['thoisu']),
    ('https://thanhnien.vn/rss/the-gioi/goc-nhin-129.rss', publisher['thanhnien'], gerne['thoisu']),
    ('https://thanhnien.vn/rss/tai-chinh-kinh-doanh/kinh-te-xanh-292.rss', publisher['thanhnien'], gerne['kinhte']),
    ('https://thanhnien.vn/rss/giai-tri/phim-101.rss', publisher['thanhnien'], gerne['giaitri']),
    ('https://thanhnien.vn/rss/giao-duc/tuyen-sinh/2021-273.rss', publisher['thanhnien'], gerne['giaoduc']),
    ('https://thanhnien.vn/rss/cong-nghe/xu-huong-244.rss', publisher['thanhnien'], gerne['khoahoc']),
    ('https://thanhnien.vn/rss/ban-doc/tu-don-thu-ban-doc-306.rss', publisher['thanhnien'], gerne['tamsu']),
    ('https://thanhnien.vn/rss/thoi-su/phap-luat-5.rss', publisher['thanhnien'], gerne['phapluat']),
    ('https://thanhnien.vn/rss/the-thao/bong-da-viet-nam-375.rss', publisher['thanhnien'], gerne['thethao']),
    ('https://thanhnien.vn/rss/doi-song/nguoi-song-quanh-ta-231.rss', publisher['thanhnien'], gerne['xahoi']),

    ('https://tuoitre.vn/rss/the-gioi.rss', publisher['tuoitre'], gerne['chinhtri']),
    ('https://tuoitre.vn/rss/thoi-su.rss', publisher['tuoitre'], gerne['thoisu']),
    ('https://tuoitre.vn/rss/kinh-doanh.rss', publisher['tuoitre'], gerne['kinhte']),
    ('https://tuoitre.vn/rss/giai-tri.rss', publisher['tuoitre'], gerne['giaitri']),
    ('https://tuoitre.vn/rss/giao-duc.rss', publisher['tuoitre'], gerne['giaoduc']),
    ('https://tuoitre.vn/rss/nhip-song-so.rss', publisher['tuoitre'], gerne['khoahoc']),
    ('https://tuoitre.vn/rss/ban-doc-lam-bao.rss', publisher['tuoitre'], gerne['tamsu']),
    ('https://tuoitre.vn/rss/phap-luat.rss', publisher['tuoitre'], gerne['phapluat']),
    ('https://tuoitre.vn/rss/the-thao.rss', publisher['tuoitre'], gerne['thethao']),
    ('https://tuoitre.vn/rss/nhip-song-tre.rss', publisher['tuoitre'], gerne['xahoi']),

    ('https://vtv.vn/trong-nuoc/chinh-tri.rss', publisher['vtv'], gerne['chinhtri']),
    ('https://vtv.vn/trong-nuoc.rss', publisher['vtv'], gerne['thoisu']),
    ('https://vtv.vn/kinh-te.rss', publisher['vtv'], gerne['kinhte']),
    ('https://vtv.vn/van-hoa-giai-tri.rss', publisher['vtv'], gerne['giaitri']),
    ('https://vtv.vn/giao-duc.rss', publisher['vtv'], gerne['giaoduc']),
    ('https://vtv.vn/cong-nghe.rss', publisher['vtv'], gerne['khoahoc']),
    ('https://vtv.vn/goc-khan-gia.rss', publisher['vtv'], gerne['tamsu']),
    ('https://vtv.vn/trong-nuoc/phap-luat.rss', publisher['vtv'], gerne['phapluat']),
    ('https://vtv.vn/the-thao.rss', publisher['vtv'], gerne['thethao']),
    ('https://vtv.vn/doi-song.rss', publisher['vtv'], gerne['xahoi']),

    ('https://genk.vn/rss/home.rss', publisher['genk'], gerne['khoahoc']),
    ('https://genk.vn/rss/tin-ict.rss', publisher['genk'], gerne['khoahoc']),
    ('https://genk.vn/rss/apps-games.rss', publisher['genk'], gerne['khoahoc']),

    ('https://nld.com.vn/thoi-su.rss', publisher['nld'], gerne['thoisu']),
    ('https://nld.com.vn/thoi-su-quoc-te.rss', publisher['nld'], gerne['chinhtri']),
    ('https://nld.com.vn/kinh-te.rss', publisher['nld'], gerne['kinhte']),
    ('https://nld.com.vn/giai-tri.rss', publisher['nld'], gerne['giaitri']),
    ('https://nld.com.vn/giao-duc-khoa-hoc.rss', publisher['nld'], gerne['giaoduc']),
    ('https://nld.com.vn/cong-nghe.rss', publisher['nld'], gerne['khoahoc']),
    ('https://nld.com.vn/ban-doc.rss', publisher['nld'], gerne['tamsu']),
    ('https://nld.com.vn/phap-luat.rss', publisher['nld'], gerne['phapluat']),
    ('https://nld.com.vn/the-thao.rss', publisher['nld'], gerne['thethao']),
    ('https://nld.com.vn/ly-tuong-song.rss', publisher['nld'], gerne['xahoi']),


]


def create_feed():
    sql_query = 'insert into feed (url, publisher_id, gerne_id) values'
    first = True
    for feed in list_feed:
        if first:
            sql_query += f"('{feed[0]}', '{feed[1]}', '{feed[2]}')"
            first = False
        else:
            sql_query += f", ('{feed[0]}', '{feed[1]}', '{feed[2]}')"

    print(sql_query)

    with open('feed.sql', 'w') as f:
        f.write(sql_query)


create_feed()
