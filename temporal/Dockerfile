FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "npm run start:workers & npm run start:api"]
