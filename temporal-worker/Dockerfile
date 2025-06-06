FROM node:18

WORKDIR /app
COPY . .

# Installe PNPM (ou utilise un build image avec pnpm intégré)
RUN npm install -g pnpm
COPY ../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ../package.json ./package.json

RUN pnpm install

CMD ["pnpm", "run", "start"]