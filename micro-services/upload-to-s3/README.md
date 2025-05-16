# Upload to S3 Lambda Function

A simple AWS Lambda function that takes a file URL, downloads it, and uploads it to an S3 bucket with public access.

## Setup

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Install the serverless-plugin-typescript:

```bash
npm install -D serverless-plugin-typescript
# or
pnpm add -D serverless-plugin-typescript
```

## Deployment

1. Configure your AWS credentials:

```bash
aws configure
```

2. Deploy the function:

```bash
npm run deploy
# or
pnpm deploy
```

## S3 Bucket Configuration

To ensure files uploaded to your S3 bucket are publicly accessible with open CORS settings, follow these steps:

### 1. Set up CORS configuration

Apply the CORS configuration from `cors-config.json` to your bucket:

```bash
aws s3api put-bucket-cors --bucket your-bucket-name --cors-configuration file://cors-config.json
```

### 2. Set up Public Access Bucket Policy

1. Edit `bucket-policy.json` and replace `BUCKET_NAME` with your actual bucket name
2. Apply the bucket policy:

```bash
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

### 3. Disable Block Public Access settings

```bash
aws s3api put-public-access-block --bucket your-bucket-name --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

## Usage

After deployment, you can use the function by making a POST request to the endpoint with the following JSON body:

```json
{
  "fileUrl": "https://example.com/path/to/file.jpg",
  "bucketName": "your-s3-bucket-name"
}
```

### Example using curl:

```bash
curl -X POST \
  https://your-api-gateway-url/dev/upload \
  -H 'Content-Type: application/json' \
  -d '{
    "fileUrl": "https://example.com/path/to/file.jpg",
    "bucketName": "your-s3-bucket-name"
  }'
```

### Example using JavaScript/Fetch:

```javascript
fetch("https://your-api-gateway-url/dev/upload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fileUrl: "https://example.com/path/to/file.jpg",
    bucketName: "your-s3-bucket-name",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error))
```

## Response

The function returns a JSON response with the URL of the uploaded file:

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://your-s3-bucket-name.s3.us-east-1.amazonaws.com/unique-filename.jpg"
}
```

## Note

Make sure your S3 bucket has the appropriate CORS and bucket policy configurations to allow public access to uploaded files.
