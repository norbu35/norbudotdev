# Build Stage
FROM ghcr.io/getzola/zola:v0.19.1 as builder
WORKDIR /app
COPY . .
# Use Exec form to avoid /bin/sh dependency in distroless image
RUN ["zola", "build"]

# Serve Stage
FROM nginx:alpine
COPY --from=builder /app/public /usr/share/nginx/html
EXPOSE 80
