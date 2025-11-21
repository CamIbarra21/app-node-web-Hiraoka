# Imagen base
FROM node:18
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
