FROM node:20-alpine

RUN apk --no-cache add git

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Port
ENV NITRO_PORT=8080

EXPOSE 8080
CMD [ "node", ".output/server/index.mjs" ]