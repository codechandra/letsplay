#!/bin/bash
set -e

# AWS Bootstrap Script for letsplay
# Usage: ./aws_bootstrap.sh <key-pair-name> <github-repo-url>

KEY_NAME=$1
REPO_URL=$2
INSTANCE_TYPE="t3.medium"
AMI_ID="ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS (us-east-1)
SEC_GROUP_NAME="letsplay-sg"

if [ -z "$KEY_NAME" ] || [ -z "$REPO_URL" ]; then
    echo "Usage: ./aws_bootstrap.sh <aws-key-pair-name> <github-repo-url>"
    echo "Example: ./aws_bootstrap.sh my-key https://github.com/username/letsplay.git"
    exit 1
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
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-groups "$SEC_GROUP_NAME" \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Launched $INSTANCE_ID. Waiting for running state..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID
PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo ">>> Instance IP: $PUBLIC_IP"
echo "Waiting 60s for SSH..."
sleep 60

echo ">>> 3. bootstrapping Server..."
ssh -o StrictHostKeyChecking=no -i "~/.ssh/$KEY_NAME.pem" ubuntu@$PUBLIC_IP <<EOF
    # 1. Install Docker & Git
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose-plugin git
    sudo usermod -aG docker ubuntu
    
    # 2. Clone Repository
    git clone $REPO_URL letsplay
    
    # 3. Start Application
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
