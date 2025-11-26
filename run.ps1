# Notes Backend - Start Script for Windows PowerShell

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Notes Backend - Start Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check Node version
Write-Host "Checking Node.js version..." -ForegroundColor Blue
$nodeVersion = node -v
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Blue

# Check npm version
Write-Host "Checking npm version..." -ForegroundColor Blue
$npmVersion = npm -v
Write-Host "npm version: $npmVersion" -ForegroundColor Blue

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Blue
    Copy-Item .env.example .env
    Write-Host ".env file created. Please update it with your actual values." -ForegroundColor Yellow
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

# Start Docker containers
Write-Host "Starting Docker containers..." -ForegroundColor Blue
docker compose up -d

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Run Prisma migrations
Write-Host "Running Prisma migrations..." -ForegroundColor Blue
docker compose exec -T backend npx prisma migrate deploy

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Blue
docker compose exec -T backend npx prisma generate

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Backend started successfully!" -ForegroundColor Green
Write-Host "API available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
Write-Host "To stop the server, run: docker compose down" -ForegroundColor Yellow
