# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Node.js
FROM node:18-alpine

# Install serve globally for production static file serving
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Copy the built files from the build stage
COPY --from=build /app/dist /app

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 8080
EXPOSE 8080

# Serve the static files with proper SPA routing
CMD ["serve", "-s", "/app", "-l", "8080"]