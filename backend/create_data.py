import requests
from bs4 import BeautifulSoup as bs

API_URL = 'http://localhost:8000/api/v1/admin'

headers = {'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQyNzM0NjA1LCJpYXQiOjE2NDIxMjk4MDUsImp0aSI6ImRmZGY0YTk4YzM4ODRkNjZhOWIxYWQ3OGJmZGYwZTAwIiwidXNlcl9pZCI6ImQ0YmRkZjczLTE4MmItNGY0Yy1hZmI4LTViMDI3YzNiNTlmNiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpc19hZG1pbiI6dHJ1ZX0.ogjp1c0FRUenhMEQ8PeiWob9w4q_0fL7ilWEtUmFexg'}

web_headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'}

# GERNE_LIST = ['Thời sự', 'Chính trị', 'Kinh tế', 'Xã hội', 'Thể thao', 'Pháp luật', 'Khoa học', 'Giải trí', 'Giáo dục', 'Tâm sự']

# for gerne in GERNE_LIST:
#     r = requests.post(API_URL + '/gernes/', data={'name': gerne}, headers=headers)
#     print(r.text)


# # def download(url):
# #     r = requests(url, headers=headers)
# #     if r.status_code == 200:
# #         print(r.data)


PUBLISHER_LIST = [
    'https://vnexpress.net/',
    'https://dantri.com.vn/',
    'https://vietnamnet.vn/',
    'https://thanhnien.vn/',
    'https://tuoitre.vn/',
    'https://zingnews.vn/',
    'https://vtv.vn/',
    'https://genk.vn/',
    'https://baophapluat.vn/',
    'http://kenh14.vn/',
    'https://laodong.vn/',
    'https://tienphong.vn/'
]

PUBLISHER_NAME = [
    'VnExpress',
    'Dân trí',
    'Báo VietNamNet News',
    'Báo Thanh Niên',
    'Báo Tuổi Trẻ',
    'Zing News',
    'Báo Vtv',
    'GenK',
    'Báo Pháp Luật',
    'Kênh14',
    'Báo Lao Động',
    'Báo Tiền Phong'
]

for index, url in enumerate(PUBLISHER_LIST):
    r = requests.get(url, headers=web_headers)
    # print(r.status_code)
    soup = bs(r.text, 'lxml')
    links = soup.find_all('link')
    # print([link.attrs['rel'] for link in links])
    logos = [link.attrs['href'] for link in links if 'icon' in link.attrs['rel'][0] or 'icon' in link.attrs['rel']]
    logos = [url + logo if logo.startswith('/') else logo for logo in logos]

    for logo in logos:
        # r = requests.get(logo)
        # if r.status_code == 200:
        #     r = requests.post(API_URL + '/publishers/', data={'url': url, 'name': PUBLISHER_NAME[index], 'logo': logo}, headers=headers)
        #     break
        print(logo)
