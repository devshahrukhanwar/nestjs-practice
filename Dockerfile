# Use Node.js LTS version for development
FROM node:20-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Install bash for better shell experience
RUN apk add --no-cache bash

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port that NestJS runs on
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "start:dev"]

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from development stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]