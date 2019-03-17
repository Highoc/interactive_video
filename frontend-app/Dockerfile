FROM node:8.12.0

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install -qy

COPY . .

EXPOSE 3000
