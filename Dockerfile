FROM node:14-alpine

RUN apk --no-cache add git

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./
RUN yarn install \
  --production \
  --non-interactive \
  --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
