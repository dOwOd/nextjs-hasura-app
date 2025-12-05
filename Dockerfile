FROM node:22-alpine@sha256:9632533eda8061fc1e9960cfb3f8762781c07a00ee7317f5dc0e13c05e15166f
COPY ./nextjs-hasura-app app
WORKDIR /app
RUN yarn install