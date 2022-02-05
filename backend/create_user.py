import requests
import json
import numpy as np
from datetime import datetime

API_URL = 'http://localhost:8000/api/v1/'

LOGIN_PATH = 'login'
REGISTER_PATH = 'register'

USERNAME = 'admin'
PASSWORD = '123456'

NUMBER_USER = 200


def num_to_str(num, length):
    base = 1
    for _ in range(length - 1):
        base *= 10

    zeros = ''

    rep = num
    if num == 0:
        rep = 1

    while((rep / base) < 1):
        zeros += '0'
        base /= 10

    return zeros + str(num)


def create_profile():
    sql_query = 'insert into profile(account_id, first_name, last_name, gender, date_of_birth, address, interest) values'
    first = True
    year_now = datetime.now().year
    for i in range(NUMBER_USER):
        username = 'user' + num_to_str(i, 4)
        r = requests.post(API_URL + REGISTER_PATH, data={'username': username, 'password': username, 'email': username + '@gmail.com'})
        res = r.content
        data = json.loads(res)
        id = data['id'].replace('-', '')

        gender = 'M' if np.random.randint(2) == 1 else 'F'


        age = np.random.binomial(85, 0.15) + 10

        date_of_birth = datetime(day=1, month=1, year=year_now - age).strftime('%Y-%m-%d')

        if first:
            sql_query += f"('{id}', '', '', '{gender}', '{date_of_birth}', '', '')"
            first = False
        else:
            sql_query += f", ('{id}', '', '', '{gender}', '{date_of_birth}', '', '')"


    with open('profile.sql', 'w') as f:
        f.write(sql_query)

    print(sql_query)


create_profile()
