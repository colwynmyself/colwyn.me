# colwyn.me HTML Builder

[![CircleCI](https://circleci.com/gh/colwynmyself/colwyn.me.svg?style=svg)](https://circleci.com/gh/colwynmyself/colwyn.me)
[![Known Vulnerabilities](https://snyk.io/test/github/colwynmyself/colwyn.me/badge.svg)](https://snyk.io/test/github/colwynmyself/colwyn.me)

I wanted to build a no-JS version of my site and decided to build a (janky) HTML rendering engine to go along with it.
It's a pretty basic app to serve since it just creates a bunch of static files in `public/`. I have a Docker setup for
Nginx in here, but I could easily use something like S3 in the future.

## Setup

1. Install Node.js v18
2. `npm ci`

### Snyk Integration

This project has a Snyk integration. To run the `snyk:test:*` commands you will need to run `npm run snyk:auth` and have
access to the `colwynmyself` organization in Snyk. Otherwise just check out the build badge.

## Building

`npm run build` will build once. `npm run watch` will watch for changes in `src/` and automatically build them.

## Local Dev

1. `npm run start` at least once
   1. This automatically mounts `./public` so you can run `npm run watch` and see live updates
2. Visit `http://localhost:8080` in the browser

## Deploying

This app is deployed with Digital Ocean Apps. A new deployment is kicked off with any commit to `main`.

### CircleCI

This project uses a bunch of contexts to build and deploy the application. There's some manual setup involved, but it's
nothing too crazy.

#### Project Specific Environment Variables

These are the environment variables needed to let CircleCI deploy the Digital Ocean application:

* `DIGITALOCEAN_APP_ID` - The ID of the application. Go to the application in your browser and fetch the ID.

#### Organization Level Contexts

* `digitalocean`
  * `DIGITALOCEAN_TOKEN` - Read/write personal access token to Digital Ocean
* `dockerhub`
  * `DOCKERHUB_USERNAME` - Username with access to DockerHub
  * `DOCKERHUB_TOKEN` - Personal access token to DockerHub
* `snyk`
  * `SNYK_TOKEN` - Personal access token to Snyk
