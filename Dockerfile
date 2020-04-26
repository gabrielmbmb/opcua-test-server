ARG NODE_VERSION=13.8.0-slim
FROM node:${NODE_VERSION}

LABEL maintainer="gmartinbdev@gmail.com"

ENV OPCUA_TEST_SERVER_VERSION 0.0.1

RUN apt-get update && \
	apt-get install -y ca-certificates && \
	apt-get install -y openssl && \
    npm install -g pm2

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

ADD . /usr/src/app
RUN npm run build

CMD ["pm2-runtime", "dist/index.js"]
