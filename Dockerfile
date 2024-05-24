FROM node:20-alpine


WORKDIR /the/workdir/path

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .


RUN chmod -R 755 /the/workdir/path

EXPOSE 3113

CMD ["npm", "start"]



