FROM google/debian:wheezy

# Install requirements
RUN apt-get update -y && apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates ruby-full

# Install NodeJS
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
ENV PATH $PATH:/nodejs/bin

RUN npm install -g nodemon eslint eslint-plugin-react
RUN mkdir -p public/js

WORKDIR /app
EXPOSE 80

CMD ["npm", "run", "dev"]