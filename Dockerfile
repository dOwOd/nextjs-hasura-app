FROM node:22-alpine@sha256:2806b421fa8e210696187da646823d2f5edfde2e6fe09e149a4ac715db8f15df
COPY ./nextjs-hasura-app app
WORKDIR /app
RUN yarn install