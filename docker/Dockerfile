# Production Dockerfile
FROM nginx:alpine

# Copy frontend files to nginx html directory
COPY frontend/ /usr/share/nginx/html/

# Expose port 7904
EXPOSE 7904

# Configure nginx to listen on port 7904
RUN echo 'server { \
    listen 7904; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

