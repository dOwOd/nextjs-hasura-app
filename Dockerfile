FROM node:22-alpine@sha256:ad1aedbcc1b0575074a91ac146d6956476c1f9985994810e4ee02efd932a68fd
COPY ./nextjs-hasura-app app
WORKDIR /app
RUN yarn install