# STAGE 1: Installing dependencies and build
FROM node:22 AS build

WORKDIR /app

ENV APP_ENV=production

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Creating image to run the application
FROM node:22 AS production

WORKDIR /app

ENV APP_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/database/migrations ./database/migrations

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
