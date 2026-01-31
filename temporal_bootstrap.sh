#!/bin/bash
set -e

# Arguments
DB_HOST=$1
DB_USER=$2
DB_PASS=$3

echo "Bootstrapping Temporal..."
# Install Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Setup Temporal with Postgres
# We use the auto-setup image but point to external RDS
mkdir -p /home/ubuntu/temporal
cd /home/ubuntu/temporal

# Create separate DB for Temporal if not exists (needs psql, assuming created or we use same DB with different schema - simpler to use 'temporal' DB created by my script)

echo "Starting Temporal via Docker..."
# Note: auto-setup handles schema setup
sudo docker run -d --name temporal \
  -e DB=postgres12 \
  -e DB_PORT=5432 \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PWD=$DB_PASS \
  -e POSTGRES_SEEDS=$DB_HOST \
  -e DBNAME=temporal \
  -p 7233:7233 \
  -p 8233:8233 \
  temporalio/auto-setup:latest

echo "Starting Temporal UI..."
sudo docker run -d --name temporal-ui \
  -e TEMPORAL_ADDRESS=temporal:7233 \
  -e TEMPORAL_CORS_ORIGINS="http://localhost:3000" \
  --link temporal \
  -p 8080:8080 \
  temporalio/ui:latest

echo "Temporal Started!"
