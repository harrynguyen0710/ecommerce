FROM node:18-alpine

WORKDIR /app

COPY . .


RUN npm install --production

EXPOSE 5005

CMD ["node", "server.js"]

