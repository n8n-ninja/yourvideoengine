#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section header
print_header() {
  echo -e "\n${YELLOW}====== $1 ======${NC}\n"
}

# Check if environment argument is provided
if [ -z "$1" ]; then
  echo "Please specify an environment (dev or prod)"
  echo "Usage: ./scripts/deploy-remotion.sh <env> [component]"
  echo "  env: dev or prod"
  echo "  component: (optional) frontend, api, or all (default)"
  exit 1
fi

# Validate environment
ENV=$1
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
  echo "Environment must be 'dev' or 'prod'"
  exit 1
fi

# Determine which component to deploy
COMPONENT=${2:-"all"}
if [ "$COMPONENT" != "frontend" ] && [ "$COMPONENT" != "api" ] && [ "$COMPONENT" != "all" ]; then
  echo "Component must be 'frontend', 'api', or 'all'"
  exit 1
fi

# Move to root directory
cd "$(dirname "$0")/.."
ROOT_DIR="$(pwd)"

# Deploy Remotion frontend
deploy_frontend() {
  print_header "Deploying Remotion frontend ($ENV)"
  
  cd "${ROOT_DIR}/remotion"
  
  if [ "$ENV" == "dev" ]; then
    npm run d
  else
    npm run d:prod
  fi
  
  # Deploy engine regardless of environment (shared)
  print_header "Deploying Remotion engine"
  npm run d:engine
  
  cd "${ROOT_DIR}"
  echo -e "${GREEN}Frontend deployment complete!${NC}"
}

# Deploy Remotion API
deploy_api() {
  print_header "Deploying Remotion API ($ENV)"
  
  cd "${ROOT_DIR}/remotion-api"
  npx serverless deploy --stage $ENV
  cd "${ROOT_DIR}"
  
  echo -e "${GREEN}API deployment complete!${NC}"
}

# Deploy components based on selection
if [ "$COMPONENT" == "frontend" ] || [ "$COMPONENT" == "all" ]; then
  deploy_frontend
fi

if [ "$COMPONENT" == "api" ] || [ "$COMPONENT" == "all" ]; then
  deploy_api
fi

print_header "Deployment Summary"
echo -e "Environment: ${GREEN}$ENV${NC}"
echo -e "Components deployed: ${GREEN}$COMPONENT${NC}"
echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}" 