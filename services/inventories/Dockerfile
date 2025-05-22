# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Generate Prisma client    
RUN npx prisma generate

# Expose the port your app runs on (change if needed)
EXPOSE 5002

# Start the application
CMD ["npm", "start"]