# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

# Copy the rest of the application code
COPY . .

# Install nodemon for development
RUN npm install --save-dev nodemon

# Expose the port the app runs on
EXPOSE 5003

# Start the service
CMD ["npm", "run", "dev"]