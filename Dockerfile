FROM node:20-alpine

# Instalar OpenSSL 3.x y otros build tools necesarios para Prisma
RUN apk add --no-cache openssl=~3 python3 make g++ ca-certificates

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generar Prisma Client DESPUÉS de copiar todo
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
