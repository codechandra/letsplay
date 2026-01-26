#!/bin/bash
# AWS User Data Script for letsplay
# Paste this into "Advanced Details -> User Data" when launching your instance.

# 1. Create SWAP Memory (Crucial for t2.micro 1GB RAM)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 2. Install Docker & Git
apt-get update
apt-get install -y docker.io docker-compose-plugin git
usermod -aG docker ubuntu

# 3. Clone Repository (Authenticated)
# We use your PAT to bypass password prompts
git clone https://<YOUR_GITHUB_TOKEN>@github.com/codechandra/letsplay.git /home/ubuntu/letsplay

# Fix permissions (User Data runs as root)
chown -R ubuntu:ubuntu /home/ubuntu/letsplay

# 4. Start Application
cd /home/ubuntu/letsplay
# Build and run in detached mode
docker compose -f docker-compose.prod.yml up -d --build
