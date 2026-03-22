#!/usr/bin/env bash
# SheetAPI - cURL Examples

BASE_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
API_KEY="sk_your_api_key_here"
SHEET="Products"

# Read all
curl -sL "${BASE_URL}?key=${API_KEY}&action=read&sheet=${SHEET}" | python3 -m json.tool

# Filter
curl -sL "${BASE_URL}?key=${API_KEY}&action=read&sheet=${SHEET}&Category=Electronics" | python3 -m json.tool

# Create (Pro)
curl -sL -X POST "${BASE_URL}?key=${API_KEY}&action=create&sheet=${SHEET}" \
  -H "Content-Type: application/json" \
  -d '{"Name":"USB Hub","Price":24.99}' | python3 -m json.tool

# Update (Pro)
curl -sL -X POST "${BASE_URL}?key=${API_KEY}&action=update&sheet=${SHEET}&row=2" \
  -H "Content-Type: application/json" \
  -d '{"Price":19.99}' | python3 -m json.tool

# Delete (Pro)
curl -sL -X POST "${BASE_URL}?key=${API_KEY}&action=delete&sheet=${SHEET}&row=2" \
  -H "Content-Type: application/json" \
  -d '{}' | python3 -m json.tool
