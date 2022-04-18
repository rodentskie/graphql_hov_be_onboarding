FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN apk update
RUN npm ci

COPY . .

RUN npm run build
ARG BUILD_PORT
ENV PORT=${BUILD_PORT}
EXPOSE ${PORT}

CMD ["npm", "start"]