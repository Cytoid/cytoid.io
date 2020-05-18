FROM node:14-alpine

RUN apk --no-cache add git

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN yarn install \
  --production \
  --non-interactive \
  --frozen-lockfile


EXPOSE 8080
CMD [ "node", "server.js" ]
