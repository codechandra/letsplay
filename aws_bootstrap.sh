# AWS Bootstrap Script for letsplay (Free Tier Optimized)
# Usage: ./aws_bootstrap.sh <key-pair-name> <github-repo-url>

KEY_NAME=$1
REPO_URL=$2
INSTANCE_TYPE="t2.micro" # Free Tier Eligible
AMI_ID="ami-0f5ee92e2d63afc18" # Ubuntu 22.04 LTS (ap-south-1)
SEC_GROUP_NAME="letsplay-sg"

# ... (Security Group and Launch logic remains same) ...

echo ">>> 3. Bootstrapping Server (Free Tier Optimization)..."
ssh -o StrictHostKeyChecking=no -i "~/.ssh/$KEY_NAME.pem" ubuntu@$PUBLIC_IP <<EOF
    # 1. Create SWAP Memory (Crucial for 1GB RAM instances)
    echo "Creating 4GB Swap..."
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

    # 2. Install Docker & Git
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose-plugin git
    sudo usermod -aG docker ubuntu
    
    # 3. Clone Repository
    git clone $REPO_URL letsplay
    
    # 4. Start Application
    cd letsplay
    docker compose -f docker-compose.prod.yml up -d --build
EOF

echo ""
echo ">>> BOOTSTRAP COMPLETE!"
echo "1. Frontend: http://$PUBLIC_IP"
echo "2. Temporal: http://$PUBLIC_IP:8081"
echo ""
echo ">>> NEXT STEPS FOR CI/CD:"
echo "1. Go to your GitHub Repo -> Settings -> Secrets and Variables -> Actions"
echo "2. Add Secret 'EC2_HOST' = $PUBLIC_IP"
echo "3. Add Secret 'EC2_SSH_KEY' = (Content of ~/.ssh/$KEY_NAME.pem)"
echo "Now every git push will auto-deploy!"
