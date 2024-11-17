# Stage 1: Build
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine AS serve

# Install a lightweight HTTP server for production
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist

# Expose the port on which the app runs
EXPOSE 5000

# Start the server
CMD ["serve", "-s", "dist", "-l", "5000"]