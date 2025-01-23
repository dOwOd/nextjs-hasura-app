FROM node:22-alpine@sha256:e2b39f7b64281324929257d0f8004fb6cb4bf0fdfb9aa8cedb235a766aec31da
COPY ./nextjs-hasura-app app
WORKDIR /app
RUN yarn install