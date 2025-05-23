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
  ENGINE_OUTPUT=$(npm run d:engine 2>&1)

  # Extraire le nom de la Lambda depuis la sortie
  LAMBDA_NAME=$(echo "$ENGINE_OUTPUT" | grep -oE 'Already exists as [^ ]+' | awk '{print $4}')
  if [ -z "$LAMBDA_NAME" ]; then
    LAMBDA_NAME=$(echo "$ENGINE_OUTPUT" | grep -oE 'Deployed as [^ ]+' | awk '{print $3}')
  fi

  if [ -z "$LAMBDA_NAME" ]; then
    echo "❌ Impossible de trouver le nom de la Lambda Remotion dans la sortie CLI"
    exit 1
  fi

  echo "Remotion Lambda function name: $LAMBDA_NAME"


  export REMOTION_LAMBDA_FUNCTION_NAME="$LAMBDA_NAME"

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

# Always print API URLs
if [ "$ENV" == "prod" ]; then
  RENDER_URL="https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod/render"
  STATUS_URL="https://0lxwxeqkpl.execute-api.us-east-1.amazonaws.com/prod/status"
else
  RENDER_URL="https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/render"
  STATUS_URL="https://ezh73b8y6l.execute-api.us-east-1.amazonaws.com/dev/status"
fi

echo -e "${YELLOW}Remotion Render URL:${NC}  ${GREEN}${RENDER_URL}${NC}"
echo -e "${YELLOW}Remotion Status URL:${NC}  ${GREEN}${STATUS_URL}${NC}"
echo ""

CONFIG_FILE="remotion-config.$ENV.json"
cat > "${ROOT_DIR}/$CONFIG_FILE" <<EOF
{
  "remotionLambdaFunctionName": "$LAMBDA_NAME",
  "serveUrl": "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine-$ENV",
  "renderUrl": "$RENDER_URL",
  "statusUrl": "$STATUS_URL"
}
EOF

cp "${ROOT_DIR}/$CONFIG_FILE" "${ROOT_DIR}/remotion-api/$CONFIG_FILE"
cp "${ROOT_DIR}/$CONFIG_FILE" "${ROOT_DIR}/remotion/$CONFIG_FILE"

echo -e "${GREEN}Deployment completed successfully!${NC}" 