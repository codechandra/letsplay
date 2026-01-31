#!/bin/bash
set -e

# Arguments
RDS_URL=$1
DB_USER=$2
DB_PASS=$3
TEMPORAL_HOST=$4

echo "Bootstrapping Backend..."
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk maven git

# Clone Repo (Public or use token if private)
# For now assuming public or we pull manually. 
# Since I can't put credentials here effectively, I'll copy the local code via SCP in the main flow.
# But for now, let's assume I SCP the 'backend' folder.

echo "Building Backend..."
cd /home/ubuntu/letsplay/backend
mvn clean package -DskipTests

echo "Starting Backend..."
# Run in background
nohup java -jar target/letsplay-backend-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url="$RDS_URL" \
  --spring.datasource.username="$DB_USER" \
  --spring.datasource.password="$DB_PASS" \
  --temporal.target="$TEMPORAL_HOST:7233" \
  > app.log 2>&1 &

echo "Backend Started!"
