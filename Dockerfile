FROM node:22.14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3331

CMD ["npm", "start"]
