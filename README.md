#node-starter

A small but non-trivial Node web app. This was made for a coding challenge, and part of the challenge was not to use a framework, so all of the dynamic content uses plain Javascript with Lodash templating.

My intent here was to use the "good parts" of Javascript, and I lean heavily on many ES6 features. I use a functional style where possible, with a healthy amount of Lodash. 

Styling the web app was my last priority, so I just used Bootstrap to make it look a few steps better than Geocities ca. 1997. Unfortunately, it doesn’t display images because IMDB denies referrals from non-IMDB sites, and caching them would require an S3 bucket and CloudFront.

The client side app lives in `app.js` and `src/`. The server code is in `server.js`, and the Redis interface in `redisdb.js`. There's also a `db.js` that doesn't work because one of its dependencies is broken, but I left it there to remind myself to revisit it later.

## Local development

For local develoment, the app runs inside a Docker container. To start everyting, use `docker-compose up`. Or, start the components separately so you can restart the app container without affecting the cache container:

    docker-compose up redis
    docker-compose up app

Other interesting commands include:

    make lint
    make test
