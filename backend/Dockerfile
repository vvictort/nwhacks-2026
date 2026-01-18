FROM node:20-alpine

WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# BUILD FIRST (compiles TypeScript)
RUN npm run build

EXPOSE 3000

# RUN LATER (starts production server)
CMD ["npm", "start"]
