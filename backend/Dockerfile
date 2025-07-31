# Utilise une image Node officielle comme base
FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache openssl

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances npm
RUN npm install

# Copier tout le code source dans le conteneur
COPY . .

# Générer le client Prisma (nécessaire avant compilation)
RUN npx prisma generate

# Compiler le code TypeScript
RUN npx tsc

# Vérification de l'arborescence dist
RUN ls -l dist

# Exposer le port de l'application
EXPOSE 5000

# Lancer les migrations, le seed, puis le serveur compilé
CMD ["sh", "-c", "echo '⏳ Waiting for database...' && sleep 10 && npx prisma migrate deploy && npm run db:seed && node dist/server.js"]
