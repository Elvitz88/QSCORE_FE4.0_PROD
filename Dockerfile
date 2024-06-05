# Build stage: Use a Node.js 18 Alpine image for a smaller footprint
FROM node:18-alpine AS build-stage

# Set the working directory
WORKDIR /app

# Install dependencies
# Copying package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build your application
RUN yarn build

# Production stage: Use an Nginx Alpine image to reduce size
FROM nginx:stable-alpine AS production-stage

# Set working directory to Nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build-stage /app/dist .

# Expose port 8000 on the container
EXPOSE 8001

# Complete Nginx configuration for SPA support and to listen on port 8000
RUN echo $'server {\n\
    listen 8001;\n\
    location / {\n\
        root   /usr/share/nginx/html;\n\
        index  index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Nginx will start automatically when the container is run