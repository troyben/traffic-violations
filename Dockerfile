FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vue app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Install serve package globally for production hosting
RUN npm install -g serve

# Start the application in production mode
CMD ["npm", "run", "dev"]