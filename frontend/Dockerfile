FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source code
COPY . .

# Expose port 5173 for Vite
EXPOSE 5173

# Start the Vite development server allowing external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
