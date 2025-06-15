# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY waggo/package*.json ./
RUN npm install

COPY waggo .

CMD ["npm", "run", "dev"]
