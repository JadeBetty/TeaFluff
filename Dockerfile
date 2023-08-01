FROM node:20.3.1

WORKDIR /usr/src/index.js

COPY package*.json ./

RUN npm install

COPY . . 

CMD ["npm", "start"]
