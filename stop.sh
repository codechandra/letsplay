#!/bin/bash

# letsplay Stop Script

echo "Stopping all letsplay services..."

# 1. Stop Backend
echo "Stopping Backend (Spring Boot)..."
lsof -ti:8082 | xargs kill -9 >/dev/null 2>&1

# 2. Stop Frontend
echo "Stopping Frontend (Vite)..."
lsof -ti:5173,5174 | xargs kill -9 >/dev/null 2>&1

# 3. Stop Infrastructure
echo "Stopping Infrastructure (Docker)..."
cd infra
docker compose down
cd ..

echo "All services stopped."
