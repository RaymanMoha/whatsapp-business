FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global npm@11.6.2
COPY package.json package-lock.json ./

FROM base AS dependencies
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run build

FROM base AS production-dependencies
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-bookworm-slim AS web
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]

FROM node:20-bookworm-slim AS bot
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY package.json ./package.json
COPY src ./src
EXPOSE 8080
CMD ["npm", "run", "bot:start"]
