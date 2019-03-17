FROM node:carbon

ADD . /app

RUN apt-get update
WORKDIR /app

RUN npm install

EXPOSE 3000
USER nobody
