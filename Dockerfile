# Use an existing Docker image as a base
FROM node:alpine

# Set working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm config set registry https://registry.npm.taobao.org
# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Expose the port that the React app will run on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
