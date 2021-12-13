FROM python:3.8
# python env
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working dir
WORKDIR /backend

COPY Pipfile Pipfile.lock /backend

RUN pip install pipenv && pipenv install --system

COPY . /backend

