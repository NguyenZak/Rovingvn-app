#!/bin/bash
# Simple script to test if tours endpoint is working

echo "Testing tours API without join..."
echo ""

# Test the apply-migration endpoint
curl -s http://localhost:3000/api/apply-migration 2>&1 | head -50

echo ""
echo "==========================================="
echo ""
