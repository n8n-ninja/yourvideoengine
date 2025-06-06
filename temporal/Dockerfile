FROM node:20

RUN apt-get update && apt-get install -y netcat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

COPY config/dynamicconfig /etc/temporal/config/dynamicconfig

CMD ["sh", "-c", "npm run start:workers & npm run start:api"]
