# Etapa 1: Compilar TypeScript
FROM node:20 AS builder
WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TS -> JS
RUN npm run build

# Etapa 2: Imagen final para producción
FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copiar dist desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Copiar .env si lo necesitás
COPY .env .env

EXPOSE 3000
CMD ["node", "dist/server.js"]
