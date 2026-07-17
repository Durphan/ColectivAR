FROM node:22-alpine

ARG CLIENT_ID
ARG CLIENT_SECRET

WORKDIR /usr/code

COPY server/pnpm-lock.yaml ./
COPY server/package.json ./server/

RUN corepack enable && pnpm ci

COPY server/ ./server/

WORKDIR /usr/code/server

EXPOSE 8080 8081

USER node

CMD ["node", "src/index.js"]
