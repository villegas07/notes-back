#!/bin/bash

set -e

echo "========================================="
echo "Notes Backend - Start Script"
echo "========================================="

# Check Node version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Check npm version
echo "Checking npm version..."
NPM_VERSION=$(npm -v)
echo "npm version: $NPM_VERSION"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo ".env file created. Please update it with your actual values."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Start Docker containers
echo "Starting Docker containers..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Run Prisma migrations
echo "Running Prisma migrations..."
docker compose exec -T backend npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
docker compose exec -T backend npx prisma generate

echo "========================================="
echo "Backend started successfully!"
echo "API available at: http://localhost:3000"
echo "========================================="
echo "To stop the server, run: docker compose down"
