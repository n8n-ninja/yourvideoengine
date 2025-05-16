# YourVideoEngine

A video generation service built with Remotion.

## Project Structure

This project is split into two main components:

1. **`remotion/`** - The core Remotion video rendering engine and frontend
2. **`remotion-api/`** - The serverless API that interfaces with the Remotion engine

## Environments

The system supports two environments:

- **Development (`dev`)** - For testing and development
- **Production (`prod`)** - For production use

Each environment has its own:

- Remotion frontend deployment
- Configuration settings
- API stage

## Deployment Instructions

### 1. Using the Deployment Script

The easiest way to deploy is using the deployment script:

```bash
# Deploy everything to development
./deploy.sh dev

# Deploy everything to production
./deploy.sh prod

# Deploy only the frontend to development
./deploy.sh dev frontend

# Deploy only the API to production
./deploy.sh prod api
```

### 2. Manual Deployment

#### Deploying Remotion Frontend

```bash
# Navigate to remotion directory
cd remotion

# Deploy development frontend
npm run d

# Deploy production frontend
npm run d:prod

# Deploy or update the render engine (for both environments)
npm run d:engine
```

#### Deploying the API

```bash
# Navigate to remotion-api directory
cd remotion-api

# Deploy to development
npx serverless deploy --stage dev

# Deploy to production
npx serverless deploy --stage prod
```

## Making API Calls

### Using the Remotion Client Library

We provide a helper library that makes it easy to use the API and switch between environments:

```javascript
// JavaScript
const RemotionClient = require("./examples/remotion-client")

// Create client (defaults to development environment)
const client = new RemotionClient()

// Render a video
const render = await client.renderVideo({
  composition: "MyComposition",
  inputProps: {
    title: "Hello World",
  },
})

// Check render status
const status = await client.getRenderStatus(render.renderId, render.bucketName)

// Switch to production
client.setEnvironment("prod")

// Now all calls will go to production
```

```typescript
// TypeScript
import RemotionClient from "./examples/remotion-client"

// Create client with custom config
const client = new RemotionClient({
  apiUrls: {
    dev: "https://your-dev-api.com/dev",
    prod: "https://your-prod-api.com/prod",
  },
  defaultEnvironment: "dev",
})

// The rest is the same as JavaScript
```

### Direct API Calls

When calling the API directly, you can specify which environment to use:

```javascript
// Example API call to render a video
fetch("https://your-api-url/dev/render", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    composition: "MyComposition",
    inputProps: {
      // Your input props here
    },
    environment: "dev", // Change to 'prod' for production
    // Other parameters...
  }),
})
```

## Environment Configuration

Environment-specific configuration is stored in:

- `remotion-api/config.js` - API and Lambda service configuration

If you need to change URLs, Lambda functions, or other environment settings, update these files accordingly.

## Development Workflow

See [WORKFLOW.md](./WORKFLOW.md) for detailed information about the development workflow and best practices.

## Client Examples

Check the `examples/` directory for sample code showing how to call the API from both JavaScript and TypeScript.
