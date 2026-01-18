FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm cache clean --force \
    && npm config set registry https://registry.npmjs.org/ \
    && npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:alpine
RUN echo 'server { \
    listen 5173; \
    root /usr/share/nginx/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
