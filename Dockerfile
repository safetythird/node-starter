FROM google/debian:wheezy

# Install requirements
RUN apt-get update -y && apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates ruby-full

# Install NodeJS
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
ENV PATH $PATH:/nodejs/bin

RUN npm install -g nodemon eslint eslint-plugin-react

ADD . /app
WORKDIR /app
EXPOSE 8080

CMD ["npm", "start"]