FROM node:22-alpine AS build

WORKDIR /usr/app

COPY pnpm-lock.yaml package.json ./

RUN corepack enable && pnpm ci --ignore-scripts

COPY . .

RUN npx tsc

FROM node:22-alpine

WORKDIR /usr/app

COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/package.json ./

EXPOSE 8080 8081

USER node

CMD ["node", "dist/src/index.js"]
