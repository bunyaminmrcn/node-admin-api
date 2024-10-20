FROM node:20-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

#ENV GOOGLE_APPLICATION_CREDENTIALS=./creds/fb.json

COPY . ./

EXPOSE 3042

CMD [ "npm", "run", "start" ]