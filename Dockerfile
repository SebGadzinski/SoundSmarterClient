# Use an official Node.js runtime as a parent image
FROM node:21.1.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Quasar CLI globally
RUN npm install -g @quasar/cli

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose Port
EXPOSE 9065

# Command to run the application
CMD ["npm", "run", "dev"]
