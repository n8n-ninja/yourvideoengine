FROM node:20

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y netcat \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

COPY config/dynamicconfig /etc/temporal/config/dynamicconfig

CMD ["sh", "-c", "npm run start:workers & npm run start:api"]
