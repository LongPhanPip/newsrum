from rest_framework import exceptions
import torch
import json
import pandas as pd
import numpy as np
from posts.models import Post
from .dlrm import Recommender
from .models import RecSys


class RecommenderControl():

    def get_all_recommender(self):
        return RecSys.objects.all()


    def get_rec_by_id(self, pk):
        try:
            return RecSys.objects.get(pk=pk)
        except:
            raise exceptions.NotFound('Recommender is not found')


    def get_recommend(self, user, model, filter):

        params = json.loads(model.params)
        location = model.location
        post_data = pd.read_csv(location + 'post.csv', index_col=0)
        user_data = pd.read_csv(location + 'user.csv', index_col=0)
        gerne_data = pd.read_csv(location + 'gerne.csv', index_col=0)
        click_data = pd.read_csv(location + 'click.csv', index_col=0)

        rec_sys = Recommender(len(user_data), len(post_data), len(gerne_data), params['emb_len'], params['top_layers'], params['dropout'])
        rec_sys.load_state_dict(torch.load(location + 'model.pth'))

        user_idx = int(user_data[user_data['id'] == user.pk.hex].index.values)

        click_post = click_data[click_data['user_idx'] == user_idx]['post_idx'].to_list()
        non_click_post = [p for p in range(len(post_data)) if p not in click_post]

        if filter.get('gerne_id', ''):
            non_click_post = [p for p in non_click_post if post_data.loc[p]['gerne_id'] == filter['gerne_id']]

        non_click_post_idx = np.random.choice(non_click_post, 300, replace=False)
        gerne_idx = list(post_data.loc[non_click_post_idx]['gerne_idx'])

        predict = np.squeeze(rec_sys([torch.tensor([user_idx] * 300), torch.tensor(non_click_post_idx), torch.tensor(gerne_idx)]).detach().numpy())

        top_7 = [non_click_post_idx[index] for index in np.argsort(predict)[:7]]

        return Post.objects.filter(pk__in=post_data.loc[top_7]['id'].to_list())




    def change_used_model(self, pk):
        try:
            used_model = RecSys.objects.get(in_used=1)
            used_model.in_used = 0
            used_model.save()
            new_model.save()
        except:
            pass
        new_model = RecSys.objects.get(pk=pk)
        new_model.in_used = 1
        new_model.save()


    def delete_rec_by_id(self, pk):
        self.get_rec_by_id(pk).delete()
