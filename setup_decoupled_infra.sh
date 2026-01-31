#!/bin/bash
set -e

# Configuration
APP_NAME="letsplay"
REGION="ap-south-1"  # Adjust if needed
KEY_NAME="letsplay-key-v2" # New key for fresh setup
DB_PASSWORD="letsplay-secure-pass" # In prod use Secrets Manager
MY_IP=$(curl -s http://checkip.amazonaws.com)

echo "Starting Provisioning for $APP_NAME in $REGION..."

# 0. Get VPC ID (Default)
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)
echo "Using VPC: $VPC_ID"

# 1. Create Key Pair (if not exists)
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" >/dev/null 2>&1; then
    echo "Creating Key Pair: $KEY_NAME"
    aws ec2 create-key-pair --key-name "$KEY_NAME" --query "KeyMaterial" --output text > "$KEY_NAME.pem"
    chmod 400 "$KEY_NAME.pem"
else
    echo "Key Pair $KEY_NAME exists. Assuming you have the .pem file."
fi

# 2. Create Security Groups
echo "Creating Security Groups..."

# Common SG (SSH)
SG_COMMON_ID=$(aws ec2 create-security-group --group-name "${APP_NAME}-common" --description "Allow SSH" --vpc-id "$VPC_ID" --query "GroupId" --output text || aws ec2 describe-security-groups --group-names "${APP_NAME}-common" --query "SecurityGroups[0].GroupId" --output text)
aws ec2 authorize-security-group-ingress --group-id "$SG_COMMON_ID" --protocol tcp --port 22 --cidr "0.0.0.0/0" || true

# Frontend/Web SG (HTTP) - For Load Balancer or direct access if needed, though Frontend is S3. 
# We might need this for Backend Public API access if Frontend talks to EC2 Public IP.
SG_WEB_ID=$(aws ec2 create-security-group --group-name "${APP_NAME}-web-access" --description "Allow Web Traffic" --vpc-id "$VPC_ID" --query "GroupId" --output text || aws ec2 describe-security-groups --group-names "${APP_NAME}-web-access" --query "SecurityGroups[0].GroupId" --output text)
aws ec2 authorize-security-group-ingress --group-id "$SG_WEB_ID" --protocol tcp --port 80 --cidr "0.0.0.0/0" || true
aws ec2 authorize-security-group-ingress --group-id "$SG_WEB_ID" --protocol tcp --port 8080 --cidr "0.0.0.0/0" || true # For Backend API
aws ec2 authorize-security-group-ingress --group-id "$SG_WEB_ID" --protocol tcp --port 7233 --cidr "0.0.0.0/0" || true # Temporal (Optional: restrict this)
aws ec2 authorize-security-group-ingress --group-id "$SG_WEB_ID" --protocol tcp --port 8081 --cidr "0.0.0.0/0" || true # Temporal UI

# DB SG
SG_DB_ID=$(aws ec2 create-security-group --group-name "${APP_NAME}-db" --description "Allow specific access to DB" --vpc-id "$VPC_ID" --query "GroupId" --output text || aws ec2 describe-security-groups --group-names "${APP_NAME}-db" --query "SecurityGroups[0].GroupId" --output text)
# Allow access from Common SG (Both EC2s will have Common SG)
aws ec2 authorize-security-group-ingress --group-id "$SG_DB_ID" --protocol tcp --port 5432 --source-group "$SG_COMMON_ID" || true
aws ec2 authorize-security-group-ingress --group-id "$SG_DB_ID" --protocol tcp --port 5432 --source-group "$SG_WEB_ID" || true # Fallback

# 3. Launch RDS (Postgres 14)
echo "Launching RDS Instance (shared)..."
# Check if exists (might be deleting)
if ! aws rds describe-db-instances --db-instance-identifier "${APP_NAME}-db-v2" >/dev/null 2>&1; then
    aws rds create-db-instance \
        --db-instance-identifier "${APP_NAME}-db-v2" \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 14 \
        --master-username letsplay \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --db-name letsplay \
        --vpc-security-group-ids "$SG_DB_ID" \
        --publicly-accessible \
        --no-multi-az \
        --query "DBInstance.Status" --output text
    echo "RDS Creation triggered. Waiting for availability..."
    aws rds wait db-instance-available --db-instance-identifier "${APP_NAME}-db-v2"
else
    echo "RDS ${APP_NAME}-db-v2 already exists/creating."
    aws rds wait db-instance-available --db-instance-identifier "${APP_NAME}-db-v2"
fi

# Get RDS Endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "${APP_NAME}-db-v2" --query "DBInstances[0].Endpoint.Address" --output text)
echo "RDS Endpoint: $RDS_ENDPOINT"

# 4. Launch EC2: Backend
echo "Launching Backend EC2..."
AMI_ID=$(aws ec2 describe-images --owners 099720109477 --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" "Name=state,Values=available" --query "sort_by(Images, &CreationDate)[-1].ImageId" --output text)

BACKEND_INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --count 1 \
    --instance-type t3.micro \
    --key-name "$KEY_NAME" \
    --security-group-ids "$SG_COMMON_ID" "$SG_WEB_ID" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${APP_NAME}-backend}]" \
    --query "Instances[0].InstanceId" --output text)

# 5. Launch EC2: Temporal
echo "Launching Temporal EC2..."
TEMPORAL_INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --count 1 \
    --instance-type t3.micro \
    --key-name "$KEY_NAME" \
    --security-group-ids "$SG_COMMON_ID" "$SG_WEB_ID" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${APP_NAME}-temporal}]" \
    --query "Instances[0].InstanceId" --output text)

echo "Waiting for EC2 instances to run..."
aws ec2 wait instance-running --instance-ids "$BACKEND_INSTANCE_ID" "$TEMPORAL_INSTANCE_ID"

BACKEND_IP=$(aws ec2 describe-instances --instance-ids "$BACKEND_INSTANCE_ID" --query "Reservations[0].Instances[0].PublicIpAddress" --output text)
TEMPORAL_IP=$(aws ec2 describe-instances --instance-ids "$TEMPORAL_INSTANCE_ID" --query "Reservations[0].Instances[0].PublicIpAddress" --output text)

echo "PROVISIONING COMPLETE"
echo "RDS: $RDS_ENDPOINT"
echo "Backend IP: $BACKEND_IP"
echo "Temporal IP: $TEMPORAL_IP"
echo "$RDS_ENDPOINT" > rds_endpoint.txt
echo "$BACKEND_IP" > backend_ip.txt
echo "$TEMPORAL_IP" > temporal_ip.txt
