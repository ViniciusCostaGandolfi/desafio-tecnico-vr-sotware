FROM cypress/browsers:node-22.0.0-chrome-124.0.6367.60-1-ff-125.0.2-edge-124.0.2478.51-1

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

RUN npm run test:ci

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]


