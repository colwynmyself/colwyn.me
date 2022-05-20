# colwyn.me HTML Engine

I wanted to build a no-JS version of my website and decided to build a (janky) HTML rendering engine to go along with
it. It's a pretty basic app to serve since it just creates a bunch of static files in `public/`. I have a Docker setup
for Nginx in here, but I could easily use something like S3 in the future.

## Setup

1. Install NodeJS v16
2. `npm ci`

## Building

`npm run build` will build once. `npm run watch` will watch for changes in `src/` and automatically build them.

## Local Dev

I should bulid a `docker-compose.yml` to make this even easier.

1. `docker build -t colwyn-me .`
2. `docker run --rm -it --name colwyn-me -p 8080:80 colwyn-me`
3. Visit `http://localhost:8080` in the browser

## Deploying

1. Push to Dockerhub
2. Update... something. I'm not sure how I wanna serve this yet.
