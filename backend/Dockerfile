FROM python:3.8
# python env
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working dir
WORKDIR /backend

COPY requirements.txt /backend

RUN pip install -r requirements.txt

COPY . /backend

