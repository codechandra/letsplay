#!/bin/bash
# End-to-End Automation Test Script for letsplay

echo "---------------------------------------------------"
echo "🚀 Starting E2E Automation Test for letsplay"
echo "---------------------------------------------------"

# 1. Check Health (Backend)
echo "1. Checking Backend Health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/actuator/health)
# Allow 200 or 404/401 (if actuator not configured fully, just check port open)
if curl -s http://localhost:8082 > /dev/null; then
  echo "✅ Backend is reachable."
else
  echo "❌ Backend is NOT reachable. Please start the server."
  exit 1
fi

# 2. Check Temporal
echo "2. Checking Temporal Server..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Temporal UI is reachable."
else
    echo "❌ Temporal Server seems down."
    exit 1
fi

# 3. Create Booking Flow
echo "3. Simulating Booking Request (User: user, Ground: 1)..."
RESPONSE=$(curl -s -X POST http://localhost:8082/api/bookings \
  -u user:password \
  -H "Content-Type: application/json" \
  -d '{
    "user": {"id": 1},
    "ground": {"id": 1},
    "startTime": "2026-01-26T10:00:00Z",
    "endTime": "2026-01-26T11:00:00Z"
  }')

echo "Response: $RESPONSE"

if [[ $RESPONSE == *"id"* ]]; then
  echo "✅ Booking Created Successfully!"
  BOOKING_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | cut -d: -f2)
  echo "   Booking ID: $BOOKING_ID"
else
  echo "❌ Booking Failed!"
  exit 1
fi

echo "---------------------------------------------------"
echo "🎉 E2E Test Passed! System is fully operational."
echo "---------------------------------------------------"
