import pandas as pd
import numpy as np
import torch
from torch import nn
from collections import defaultdict
from torch.utils.data import TensorDataset


class Recommender(nn.Module):
    def __init__(self, user_size, post_size, gerne_size, emb_len=8, top_layers=[256, 256, 128, 64], dropout=0.5):
        super().__init__()
        self.emb_len = emb_len
        self.emb_acc = nn.Embedding(user_size, emb_len)
        self.emb_post = nn.Embedding(post_size, emb_len)
        self.emb_gerne = nn.Embedding(gerne_size, emb_len)

        layers = []
        top_layers = [3] + top_layers
        for i in range(len(top_layers) - 1):
            layers.append(nn.Linear(top_layers[i], top_layers[i + 1]))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(p=dropout))

        self.mlp = nn.Sequential(
            *layers,
            nn.Linear(top_layers[-1], 1),
            nn.Sigmoid()
        )

    def _interact(self, x):
        batch, d = x.shape
        t = x.view(batch, -1, self.emb_len)
        z = torch.bmm(t, torch.transpose(t, 1, 2))
        _, ni, nj = z.shape
        li = torch.tensor([i for i in range(ni) for j in range(i)])
        lj = torch.tensor([j for i in range(nj) for j in range(i)])
        z_flat = z[:, li, lj]

        return z_flat

    def _apply_emb(self, x):
        return torch.concat([self.emb_acc(x[0]), self.emb_post(x[1]), self.emb_gerne(x[2])], axis=1)

    def _apply_mlp(self, x):
        return self.mlp(x)

    def forward(self, x):
        z = self._apply_emb(x)
        r = self._interact(z)
        return self._apply_mlp(r)
