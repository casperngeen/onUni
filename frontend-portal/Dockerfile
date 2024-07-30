FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# nginx server url
ARG NEXT_PUBLIC_API_ROUTE=http://localhost:8080

# set env variable here because client side components of nextjs cannot read env at runtime
ENV NEXT_PUBLIC_API_ROUTE=$NEXT_PUBLIC_API_ROUTE

RUN npm run build

EXPOSE 3001