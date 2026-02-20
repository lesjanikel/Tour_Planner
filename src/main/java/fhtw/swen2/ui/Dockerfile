FROM node:20.20.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ../../../../../.. .

EXPOSE 4200

CMD ["npm", "start"]