# Use the official Node.js 18 image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app from builder
COPY --from=builder /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
