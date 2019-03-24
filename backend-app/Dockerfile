FROM python:3.6.6

ADD . /app

RUN apt-get update
RUN apt-get install -y python3-pip
RUN pip3 install --upgrade pip
RUN pip3 install -r /app/requirements.txt

WORKDIR /app

EXPOSE 8000
USER nobody
