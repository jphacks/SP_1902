FROM node:12.13.0-alpine

WORKDIR /server

RUN apk add --no-cache --virtual=build-dependencies python make g++ && \
  apk add --no-cache curl libc6-compat && \
  apk add --no-cache yarn

COPY . .

RUN yarn --frozen-lockfile --production && \
  yarn cache clean && \
  apk del build-dependencies && \
  rm -rf /var/cache/apk/*

ENV PORT 8080

EXPOSE 8080
ENTRYPOINT ["yarn"]
CMD ["start"]
