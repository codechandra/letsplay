#!/bin/bash
set -e

# AWS Bootstrap Script for letsplay (Free Tier Optimized)
# Usage: ./aws_bootstrap.sh <key-pair-name> <github-repo-url> [github-token]

KEY_NAME=$1
REPO_URL=$2
GIT_TOKEN=$3
INSTANCE_TYPE="t2.micro" # Free Tier Eligible
AMI_ID="ami-0ff91eb5c6fe7cc86" # Ubuntu 22.04 LTS (ap-south-1) - Validated
SEC_GROUP_NAME="letsplay-sg"

if [ -z "$KEY_NAME" ] || [ -z "$REPO_URL" ]; then
    echo "Usage: ./aws_bootstrap.sh <aws-key-pair-name> <github-repo-url> [github-token]"
    exit 1
fi

# Construct Authenticated URL if token is present
if [ -n "$GIT_TOKEN" ]; then
    # Inject token into URL: https://github.com/... -> https://<token>@github.com/...
    # E.g. https://github.com/user/repo.git -> https://token@github.com/user/repo.git
    # Use simple sed replacement of the first instance of 'https://'
    AUTH_REPO_URL=$(echo "$REPO_URL" | sed "s/https:\/\//https:\/\/$GIT_TOKEN@/")
else
    AUTH_REPO_URL="$REPO_URL"
fi

echo ">>> 1. Creating Security Group..."
if ! aws ec2 describe-security-groups --group-names "$SEC_GROUP_NAME" >/dev/null 2>&1; then
    aws ec2 create-security-group --group-name "$SEC_GROUP_NAME" --description "letsplay Security Group"
    aws ec2 authorize-security-group-ingress --group-name "$SEC_GROUP_NAME" --protocol tcp --port 22 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-name "$SEC_GROUP_NAME" --protocol tcp --port 80 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-name "$SEC_GROUP_NAME" --protocol tcp --port 8081 --cidr 0.0.0.0/0
else
    echo "Security Group exists."
fi

echo ">>> 2. Launching EC2 Instance..."
# Check for existing running instance with this key to avoid duplicates
EXISTING=$(aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" "Name=key-name,Values=$KEY_NAME" --query "Reservations[*].Instances[*].InstanceId" --output text)

if [ -n "$EXISTING" ] && [ "$EXISTING" != "None" ]; then
    INSTANCE_ID=$EXISTING
    echo "Using existing running instance: $INSTANCE_ID"
else
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id $AMI_ID \
        --count 1 \
        --instance-type $INSTANCE_TYPE \
        --key-name $KEY_NAME \
        --security-groups "$SEC_GROUP_NAME" \
        --query 'Instances[0].InstanceId' \
        --output text)
    echo "Launched New Instance: $INSTANCE_ID"
    aws ec2 wait instance-running --instance-ids $INSTANCE_ID
fi

PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo ">>> Instance IP: $PUBLIC_IP"
echo "Waiting 30s for SSH to warm up..."
sleep 30

echo ">>> 3. Bootstrapping Server (Free Tier Optimization)..."
# -T avoids pseudo-terminal allocation warning
ssh -T -o StrictHostKeyChecking=no -i "~/.ssh/$KEY_NAME.pem" ubuntu@$PUBLIC_IP <<EOF
    # 1. Create SWAP Memory (Crucial for 1GB RAM instances)
    if [ ! -f /swapfile ]; then
        echo "Creating 4GB Swap..."
        sudo fallocate -l 4G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    else
        echo "Swap already exists."
    fi

    # 2. Install Docker & Git
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose-plugin git
    sudo usermod -aG docker ubuntu
    
    # 3. Clone Repository (Clean start)
    # Remove existing directory to allow re-clone
    rm -rf letsplay
    echo "Cloning repository..."
    git clone $AUTH_REPO_URL letsplay
    
    # 4. Start Application
    echo "Starting application..."
    cd letsplay
    # Prune old volumes if restarting
    sudo docker compose -f docker-compose.prod.yml down -v || true
    sudo docker compose -f docker-compose.prod.yml up -d --build
EOF

echo ""
echo ">>> DEPLOYMENT COMPLETE!"
echo "Frontend: http://$PUBLIC_IP"
echo "Temporal: http://$PUBLIC_IP:8081"
