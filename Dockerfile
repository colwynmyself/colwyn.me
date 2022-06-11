FROM node:16-slim as build

RUN mkdir -p /tmp/app
WORKDIR /tmp/app

COPY package.json /tmp/app/package.json
COPY package-lock.json /tmp/app/package-lock.json
RUN npm ci

COPY . /tmp/app/
RUN npm run build
RUN ls -la /tmp/app/public

FROM nginx:stable as serve

COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/app/public /usr/share/nginx/html
