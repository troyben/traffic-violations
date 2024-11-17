# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with a specific network timeout
RUN npm install --network-timeout 100000

# Copy project files
COPY . .

# Set Node options and add a timeout
ENV NODE_OPTIONS="--max_old_space_size=1024"
RUN timeout 300 npm run build || exit 1

# Production stage
FROM node:20-alpine

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

WORKDIR /app

EXPOSE 3000

CMD ["serve", "-s", "dist"]