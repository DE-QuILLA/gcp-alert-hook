FROM node:22.15-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
