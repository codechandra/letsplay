#!/bin/bash
set -e

# Deployment script for LetsPlay (Production)
# Usage: ./scripts/deploy.sh

echo ">>> 1. Pulling latest code..."
git pull

echo ">>> 2. Setting up environment..."
export RDS_ENDPOINT=letsplay-db.c3wciiqaksud.ap-south-1.rds.amazonaws.com
# Add other env vars here if needed

echo ">>> 3. Building and starting services..."
sudo -E docker-compose -f docker-compose.prod.yml up -d --build

echo ">>> 4. Cleaning up old Docker images..."
sudo docker system prune -af --volumes

echo ">>> Deployment Complete!"
docker-compose -f docker-compose.prod.yml ps
