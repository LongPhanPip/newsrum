import os
from posts.models import PostClick, Post
from accounts.models import Account
from gernes.models import Gerne
import numpy as np
import pandas as pd
from datetime import datetime, date
from torch.utils.data import TensorDataset
from sklearn.model_selection import StratifiedShuffleSplit
import torch


class DataGenerator():
    def __init__(self):
        self.post = self.load_post_data()
        self.user = self.load_user_data()
        self.gerne = self.load_gerne_data()
        self.click = self.load_click_data()

        self.user_to_idx = {value: index for index, value in enumerate(self.user.id)}
        self.post_to_idx = {value: index for index, value in enumerate(self.post.id)}
        self.gerne_to_idx = {value: index for index, value in enumerate(self.gerne.id)}

        self.post['gerne_idx'] = self.post['gerne_id'].apply(lambda x: self.gerne_to_idx[x])

        self.click = self.click.groupby(['user_id', 'post_id'], as_index=False).agg({'created_at': np.max})
        self.click['user_idx'] = self.click['user_id'].apply(lambda x: self.user_to_idx[x])
        self.click['post_idx'] = self.click['post_id'].apply(lambda x: self.post_to_idx[x])
        self.click['is_last'] = self.click.groupby('user_idx')['created_at'].rank(method='first', ascending=False) == 1
        self.click['label'] = 1

    def get_non_click_post(self, user_idx, num):
        click_post = self.click[self.click["user_idx"] == user_idx]['post_idx'].to_list()
        non_click_post = [p for p in range(len(self.post)) if p not in click_post]
        non_click_post_idx = np.random.choice(non_click_post, num, replace=False)
        return non_click_post_idx


    def add_neg_sample(self, dataset, neg_ratio):
        user_click_post = dataset.groupby('user_idx', as_index=False).agg({'post_idx': lambda x: list(x)})

        for index, row in user_click_post.iterrows():
            num_neg_post = neg_ratio * len(row.post_idx)
            neg_post = [p for p in range(len(self.post)) if p not in row.post_idx]
            neg_post_idx = np.random.choice(neg_post, num_neg_post, replace=False)
            neg_data = pd.DataFrame({'user_idx': [row.user_idx] * num_neg_post, 'post_idx': neg_post_idx, 'label': [0] * num_neg_post})
            dataset = pd.concat([dataset, neg_data], axis=0, ignore_index=True)

        return dataset

    def get(self, neg_ratio, val_ratio):
        train_set = self.click[~self.click['is_last']][['user_idx', 'post_idx', 'label']]
        test_set = self.click[self.click['is_last']][['user_idx', 'post_idx', 'label']]
        train_set = self.add_neg_sample(train_set, neg_ratio)

        train_set['gerne_idx'] = list(self.post.loc[train_set['post_idx']]['gerne_idx'])
        test_set['gerne_idx'] = list(self.post.loc[test_set['post_idx']]['gerne_idx'])

        train_set, val_set = self.split_test(train_set, val_ratio)

        train_set = self.to_dataset(train_set)
        val_set = self.to_dataset(val_set)
        test_set = self.to_dataset(test_set)
        return train_set, val_set, test_set

    def to_dataset(self, data):
        return TensorDataset(torch.tensor(data['user_idx'].to_list()), torch.tensor(data['post_idx'].to_list()), torch.tensor(data['gerne_idx'].to_list()), torch.tensor(data['label'].to_list(), dtype=torch.float32))

    def split_test(self, dataset, val_ratio):
        splitter = StratifiedShuffleSplit(n_splits=1, test_size=val_ratio, random_state=52)
        for train_index, val_index in splitter.split(dataset['user_idx'], dataset['label']):
            val_set = dataset.iloc[val_index]
            train_set = dataset.iloc[train_index]

        return train_set, val_set

    def load_click_data(self):
        post_click = PostClick.objects.filter(account__is_admin=False)
        records = []
        for click in post_click:
            record = (click.account_id.hex, click.post_id.hex, click.created_at.strftime('%Y-%m-%dT%H:%M:%S'))
            records.append(record)

        data = pd.DataFrame(records, columns=['user_id', 'post_id', 'created_at'])
        return data


    def load_post_data(self):
        posts = Post.objects.all()
        records = []
        for post in posts:
            record = (post.id.hex, post.gerne.id)
            records.append(record)

        data = pd.DataFrame(records, columns=['id', 'gerne_id'])
        return data


    def load_user_data(self):
        accounts = Account.objects.filter(is_admin=False)
        records = []
        for account in accounts:
            record = (account.id.hex)
            records.append(record)

        data = pd.DataFrame(records, columns=['id'])
        return data

    def load_gerne_data(self):
        gernes = Gerne.objects.all()
        records = []

        for gerne in gernes:
            record = (gerne.id)
            records.append(record)

        data = pd.DataFrame(records, columns=['id'])
        return data

    def save(self, dir):
        self.post.to_csv(f'{dir}post.csv')
        self.user.to_csv(f'{dir}user.csv')
        self.gerne.to_csv(f'{dir}gerne.csv')
        self.click.to_csv(f'{dir}click.csv')
