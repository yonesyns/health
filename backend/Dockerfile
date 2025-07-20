# Utilise une image Node officielle comme image de base
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances en premier pour optimiser le cache Docker
COPY package.json package-lock.json ./

# Installer toutes les dépendances (y compris devDependencies)
RUN npm install

# Copier la configuration TypeScript et le code source
COPY tsconfig.json ./
COPY ./src ./src
COPY ./prisma ./prisma

# Générer le client Prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npx tsc

# Exposer le port (à adapter si besoin)
EXPOSE 5000

# Démarrer l'application
CMD ["node", "dist/server.js"] 