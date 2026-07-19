# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json tsconfig.app.json vite.config.ts index.html ./

RUN npm ci

COPY src/ ./src/

RUN npm run build

# ─── Production Server Stage ──────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Replace default nginx config to allow react-router client-side routing
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API calls to backend container
    location /api {
        proxy_pass http://server:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
