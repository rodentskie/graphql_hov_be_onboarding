FROM node:14.17.5
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3014

CMD ["npm", "start"]