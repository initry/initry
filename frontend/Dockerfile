FROM node:20.12-bookworm AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN rm -rf client

FROM builder AS copy-client
COPY --from=backend /app/openapi.json /app/openapi-codegen
RUN apt-get update
RUN apt-get install -y openjdk-17-jdk
RUN update-alternatives --config java
WORKDIR /app/openapi-codegen
RUN npx --yes @openapitools/openapi-generator-cli@2.13.1 generate -i openapi.json -g typescript-axios -c config.json -o client
WORKDIR /app
RUN cp -r openapi-codegen/client /app/client

FROM node:20.12-bookworm
WORKDIR /app
COPY --from=builder /app ./
COPY --from=copy-client /app/client ./client
EXPOSE 3000
RUN npm run build
CMD ["npm", "start"]
