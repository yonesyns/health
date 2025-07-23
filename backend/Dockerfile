# Utilise une image Node officielle comme base
FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache openssl
# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npx tsc
RUN ls -l dist
# Exposer le port de l'application
EXPOSE 5000

# Lancer l'application compilée
CMD ["node", "dist/server.js"]