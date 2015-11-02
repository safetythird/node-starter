#node-starter

Hi, GA.

A small but non-trivial Node web app. This was made for a coding challenge, and part of the challenge was not to use a framework, so all of the dynamic content uses plain Javascript.

The client side app lives in `app.js` and `src/`. The server code is in `server.js`, and the Redis API layer in `redisdb.js`. There's also a `db.js` that doesn't work because one of its dependencies is broken, but I left it there as a curiosity.

## Local development

For local develoment, the app runs inside a Docker container. To start everyting, use `docker-compose up`. Or, start the components separately so you can restart the app container without affecting the cache container:

  docker-compose up redis
  docker-compose up app

Other interesting commands include:

  make lint
  make test

