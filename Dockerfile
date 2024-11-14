# STAGE 1: Installing dependencies
FROM node:22 AS dependencies

WORKDIR /app

ENV APP_ENV=production

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Building the application
FROM node:22 AS build

ENV APP_ENV=production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Stage 3: Creating image to run the application
FROM node:22 AS production

ENV APP_ENV=production

WORKDIR /app

ENV APP_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/database/migrations ./database/migrations
COPY --from=build /app/typeorm.config.ts ./typeorm.config.ts

EXPOSE 3000