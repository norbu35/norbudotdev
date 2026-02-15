# Build Stage
FROM ghcr.io/getzola/zola:v0.19.1 as builder
WORKDIR /app
COPY . .
RUN zola build

# Serve Stage
FROM nginx:alpine
COPY --from=builder /app/public /usr/share/nginx/html
# Optional: Custom Nginx config if needed, otherwise default is fine
EXPOSE 80
