FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


RUN npm test



CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]

