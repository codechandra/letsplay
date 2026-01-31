#!/bin/bash
set -e

echo "Starting AWS Cleanup..."

# 1. Terminate all running EC2 instances
INSTANCE_IDS=$(aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query "Reservations[].Instances[].InstanceId" --output text)
if [ -n "$INSTANCE_IDS" ]; then
    echo "Terminating EC2 Instances: $INSTANCE_IDS"
    aws ec2 terminate-instances --instance-ids $INSTANCE_IDS
    echo "Waiting for instances to terminate..."
    aws ec2 wait instance-terminated --instance-ids $INSTANCE_IDS
else
    echo "No running EC2 instances found."
fi

# 2. Delete RDS Instance
echo "Checking RDS Instance: letsplay-db"
if aws rds describe-db-instances --db-instance-identifier letsplay-db >/dev/null 2>&1; then
    echo "Deleting RDS Instance..."
    aws rds delete-db-instance --db-instance-identifier letsplay-db --skip-final-snapshot --delete-automated-backups || true
    echo "Deletion initiated. This runs in background."
    # We do NOT wait for RDS deletion as it takes ~20 mins. We can start creating other things concurrently if names don't clash.
    # Note: We can't reuse "letsplay-db" name immediately. We'll use "letsplay-db-v2".
else
    echo "RDS Instance 'letsplay-db' not found."
fi

# 3. Delete S3 Buckets (letsplay-frontend-*)
BUCKETS=$(aws s3api list-buckets --query "Buckets[?starts_with(Name, 'letsplay-frontend-')].Name" --output text)
for BUCKET in $BUCKETS; do
    echo "Deleting Bucket: $BUCKET"
    aws s3 rb s3://$BUCKET --force
done

echo "Cleanup initiated successfully!"
