#!/bin/bash

# letsplay Startup Script

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Parse Arguments
RESET_VOLUMES=false
if [[ "$1" == "--reset" ]]; then
    RESET_VOLUMES=true
    echo "Reset mode enabled."
fi

# 2. Cleanup existing services and free ports
echo "Cleaning up existing processes and ports..."
./stop.sh

# 3. Check Prerequisites
echo "Checking prerequisites..."
if ! command_exists docker; then
    echo "Error: Docker is not installed or not in PATH."
    exit 1
fi

if ! command_exists mvn; then
    echo "Error: Maven (mvn) is not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "Error: Node.js (npm) is not installed."
    exit 1
fi

# 2. Start Infrastructure
echo ""
echo ">>> Starting Infrastructure (Docker)..."

# Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker daemon is not running."
    echo "Please start Docker Desktop (or your Docker provider) and try again."
    exit 1
fi

cd infra
if [ "$RESET_VOLUMES" = true ]; then
    echo "Wiping existing infrastructure and volumes..."
    docker compose down -v >/dev/null 2>&1
fi

docker compose up -d
if [ $? -ne 0 ]; then
    echo "Docker compose failed. Trying older 'docker-compose'..."
    docker-compose up -d
    if [ $? -ne 0 ]; then
        echo "Error: Failed to start infrastructure with docker-compose."
        exit 1
    fi
fi
cd ..

echo "Waiting for PostgreSQL to be ready..."
until docker exec infra-postgres-1 pg_isready -U letsplay >/dev/null 2>&1; do
  echo -n "."
  sleep 2
done
echo " PostgreSQL is ready!"

# 4. Start Backend
echo ""
echo ">>> Starting Backend (Spring Boot)..."
# We run this in background
cd backend
mvn clean spring-boot:run &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID. Logs will appear above."
cd ..

# 4. Start Frontend
echo ""
echo ">>> Starting Frontend (React)..."
cd frontend
    echo "Installing frontend dependencies..."
    npm install
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
