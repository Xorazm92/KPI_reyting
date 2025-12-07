
#!/bin/bash

echo "🧪 MM Reyting Tizimi - API Test"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://0.0.0.0:3001"

# Test 1: Health Check
echo "📡 Test 1: Health Check"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: Get Companies
echo "📊 Test 2: Get All Companies"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/companies")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Companies endpoint working${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Companies endpoint failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 3: KPI Calculation
echo "🧮 Test 3: KPI Calculation"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/test-kpi" \
  -H "Content-Type: application/json" \
  -d '{"ltifr": 2, "trir": 5}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ KPI calculation working${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ KPI calculation failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 4: Frontend Health
echo "🌐 Test 4: Frontend (Vite Dev Server)"
response=$(curl -s -w "\n%{http_code}" "http://0.0.0.0:5000")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend not accessible (HTTP $http_code)${NC}"
fi
echo ""

# Summary
echo "================================"
echo -e "${YELLOW}📝 Test Summary:${NC}"
echo "• API Server: http://0.0.0.0:3001"
echo "• Frontend: http://0.0.0.0:5000"
echo ""
echo "✅ Endi brauzerda ochib ko'ring:"
echo "   http://0.0.0.0:5000"
