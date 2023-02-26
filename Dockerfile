FROM node:18-slim as build

RUN mkdir -p /tmp/app
WORKDIR /tmp/app

COPY package.json /tmp/app/package.json
COPY package-lock.json /tmp/app/package-lock.json
RUN npm ci

COPY . /tmp/app/
RUN npm run build
RUN ls -la /tmp/app/public

FROM nginx:1.23 as serve

RUN apt-get update -y
RUN apt-get install curl=7.74.0-1.3+deb11u5

COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/public /usr/share/nginx/html
