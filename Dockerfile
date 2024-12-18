# STAGE 1: Installing dependencies
FROM node:22 AS dependencies

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/
RUN npm ci

COPY . .

# Stage 2: Building the application
FROM node:22 AS build

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Stage 3: Creating image to run the application
FROM node:22 AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/database ./database

CMD ["npm", "run", "start:prod"]