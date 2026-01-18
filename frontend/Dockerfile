FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm cache clean --force \
    && npm config set registry https://registry.npmjs.org/ \
    && npm ci --no-audit --no-fund
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
