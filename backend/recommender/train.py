from .dlrm import Recommender
from .data_loader import DataGenerator
import torch
from torch.utils.data import DataLoader
from torch import nn
import numpy as np
import pandas as pd
from datetime import datetime
import os


def val(model, val_loader, criterion):
    total_val_loss = 0
    with torch.no_grad():
        model.eval()
        for batch in val_loader:
            user, post, gerne, label = batch
            try:
                output = model([user, post, gerne]).squeeze(1)
                loss = criterion(output, label)
                total_val_loss += loss.item()
            except Exception:
                print(user, post, gerne)
                print(model([user, post, gerne]).squeeze(1))

        return total_val_loss / len(val_loader)


def train(model, train_loader, val_loader, epoch, criterion, optimizer, scheduler):
    train_loss_list = []
    val_loss_list = []
    for e in range(1, epoch + 1):
        total_train_loss = 0
        model.train()
        for batch in train_loader:
            user, post, gerne, label = batch
            optimizer.zero_grad()
            output = model([user, post, gerne]).squeeze()
            loss = criterion(output, label)
            loss.backward()
            optimizer.step()

            total_train_loss += loss.item()
        scheduler.step()
        val_loss = val(model, val_loader, criterion)
        train_loss = total_train_loss / len(train_loader)
        print(f'Epoch: {e} - train_loss: {train_loss} - val_loss: {val_loss}')
        train_loss_list.append(train_loss)
        val_loss_list.append(val_loss)

    return pd.DataFrame({'train_loss': train_loss_list, 'val_loss': val_loss_list})


def train_model(params):
    now = datetime.now()

    emb_len = params.get('emb_len', 8)
    top_layers = params.get('top_layers', [256, 256, 128, 64])
    dropout = params.get('dropout', 0.5)
    neg_ratio = params.get('neg_ratio', 5)
    val_ratio = params.get('val_ratio', 0.2)
    batch_size = params.get('batch_size', 32)
    epoch = params.get('epoch', 30)
    # epoch = 1
    lr = params.get('lr', 0.0002)

    params = {
        'emb_len': emb_len,
        'top_layers': top_layers,
        'dropout': dropout,
        'neg_ratio': neg_ratio,
        'val_ratio': val_ratio,
        'batch_size': batch_size,
        'epoch': epoch,
        'lr': lr
    }

    data_gen = DataGenerator()

    user_size = len(data_gen.user)
    post_size = len(data_gen.post)
    gerne_size = len(data_gen.gerne)

    model = Recommender(user_size, post_size, gerne_size, emb_len, top_layers, dropout)
    train_set, val_set, test_set = data_gen.get(neg_ratio, val_ratio)

    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    scheduler = torch.optim.lr_scheduler.ExponentialLR(optimizer, gamma=1)

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=True)
    results = train(model, train_loader, val_loader, epoch, criterion, optimizer, scheduler)

    hit_7 = test(model, test_set, data_gen)

    save_dir = f'recommender/models/{now.year}_{now.month}_{now.day}_{now.hour}_{now.minute}_{now.second}/'
    os.mkdir(save_dir)

    data_gen.save(save_dir)
    torch.save(model.state_dict(), save_dir + 'model.pth')
    results.to_csv(save_dir + 'train_result.csv')

    return save_dir, params, hit_7


def test(model, test_set, data_generator):
    hits = []
    for item in test_set:
        user, post, gerne, label = item
        user = int(user)
        post = int(post)
        gerne = int(gerne)

        post_idx = list(data_generator.get_non_click_post(user, 99))
        gerne_idx = list(data_generator.post.loc[post_idx]['gerne_idx'])
        post_idx += [post]
        gerne_idx += [gerne]
        predict = np.squeeze(model([torch.tensor([user] * 100), torch.tensor(post_idx), torch.tensor(gerne_idx)]).detach().numpy())

        top_7 = [post_idx[index] for index in np.argsort(predict)[:7]]
        if post in top_7:
            hits.append(1)
        else:
            hits.append(0)

    return np.sum(hits) / len(hits)
