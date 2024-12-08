FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 8000
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm run start:dev"]
