FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (cache optimization)
COPY package.json package-lock.json* ./

# FIXED: Remove --prefer-offline + add cache cleaning
RUN npm cache clean --force \
    && npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production runtime (minimal)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy ONLY production deps + built app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --no-audit --no-fund \
    && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Security: non-root user
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
