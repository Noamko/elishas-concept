# Shared site settings, included by both the HTTP and HTTPS server blocks.

root /usr/share/nginx/html;
index index.html;
charset utf-8;

# Security headers
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Compression
gzip on;
gzip_vary on;
gzip_types text/css application/javascript image/svg+xml;

# Hashed build assets - safe to cache for a year
location ^~ /assets/ {
    expires 1y;
}

# Images (book covers, portrait, favicon)
location ~* \.(jpg|jpeg|png|webp|svg|ico)$ {
    expires 7d;
}

# Pages: /course also serves course.html, etc.
location / {
    try_files $uri $uri.html $uri/ =404;
}
