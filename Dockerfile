# syntax=docker/dockerfile:1
FROM node:20

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

# We don't need to expose any ports, since we're not running a server

CMD [ "npm", "run", "start" ]