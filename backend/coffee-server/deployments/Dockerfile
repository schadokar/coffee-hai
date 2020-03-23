FROM node:alpine

WORKDIR /app

COPY ./package.json .

COPY ./.env ./.env

RUN npm install

COPY . .

CMD ["npm", "run", "start"]

