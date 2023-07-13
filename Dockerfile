FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./ 
COPY tsconfig.json ./ 
COPY *.key* ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "start"]
