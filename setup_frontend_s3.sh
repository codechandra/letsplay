#!/bin/bash
set -e

BACKEND_IP=$1
if [ -z "$BACKEND_IP" ]; then
    echo "Usage: ./setup_frontend_s3.sh <BACKEND_IP>"
    exit 1
fi

BUCKET_NAME="letsplay-frontend-$(date +%s)"
REGION="ap-south-1"

echo "Creating S3 Bucket: $BUCKET_NAME..."
aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"

echo "Enabling Website Hosting..."
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

echo "Disabling Block Public Access..."
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo "Setting Public Read Policy..."
cat <<EOF > bucket_policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file://bucket_policy.json
rm bucket_policy.json

echo "Building Frontend..."
cd frontend
# Create env file
echo "VITE_API_URL=http://$BACKEND_IP:8080/api" > .env.production
npm install
npm run build

echo "Deploying to S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME"

echo "Frontend Deployed!"
echo "URL: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"
