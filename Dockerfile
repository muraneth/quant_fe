# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN mkdir build
# Copy the rest of the application code to the working directory
# COPY . .
COPY build ./build

# Build the application if there is a build step (uncomment if needed)
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["node", "node.js"]
