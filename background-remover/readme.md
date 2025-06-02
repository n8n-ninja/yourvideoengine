📄 Project: Video Background Removal Microservice (Chroma Key)
🔧 Purpose
Create a serverless function that receives a URL to a green screen video, processes it to remove the green background using FFmpeg (chroma key), and returns a link to the new video with a transparent background hosted on S3.

🧠 Architecture Overview
Submit job

HTTP endpoint (POST /submit)

Input: public or presigned S3 URL of a green screen video

Output: JSON with jobId and initial status (PENDING)

Action: Creates a job in DynamoDB and enqueues a task in SQS

Process job

Lambda triggered by SQS

Downloads the video

Runs FFmpeg to remove green background

Uploads the processed video to S3

Updates DynamoDB job entry with status (DONE or ERROR) and output URL

Check status

HTTP endpoint (GET /status/{jobId})

Returns the status of the job and, if ready, the output URL

🧱 Stack and Components
Component Tool / Service
API Gateway HTTP endpoints via Serverless
Lambda submit, status, and worker
FFmpeg Static binary via Lambda Layer
Storage Amazon S3 (input & output)
Queue Amazon SQS
Database DynamoDB

📦 FFmpeg Behavior
Use chroma key filter to remove green background. Expected input is .mp4. Output format is .webm or .mov with alpha channel.

Example FFmpeg command:

bash
Copier
Modifier
ffmpeg -i input.mp4 -vf "chromakey=0x00FF00:0.1:0.2,format=yuva420p" -c:v libvpx output.webm
📁 serverless.yml Structure
yaml
Copier
Modifier
service: green-screen-remover

provider:
name: aws
runtime: nodejs20.x
region: eu-central-1
memorySize: 2048
timeout: 60
environment:
FFmpegLayerArn: ${ssm:/green-screen-remover/ffmpeg-layer-arn}
OUTPUT_BUCKET: your-output-bucket-name
JOBS_TABLE: green-screen-jobs

functions:
submit:
handler: src/submit.handler
events: - http:
path: submit
method: post

status:
handler: src/status.handler
events: - http:
path: status/{jobId}
method: get

worker:
handler: src/worker.handler
events: - sqs:
arn:
Fn::GetAtt: - JobQueue - Arn

layers:
ffmpeg:
arn: ${ssm:/green-screen-remover/ffmpeg-layer-arn} # e.g., custom FFmpeg Lambda Layer ARN

resources:
Resources:
JobQueue:
Type: AWS::SQS::Queue
Properties:
QueueName: GreenScreenJobQueue

    JobsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: green-screen-jobs
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: jobId
            AttributeType: S
        KeySchema:
          - AttributeName: jobId
            KeyType: HASH

🧬 Data Model (DynamoDB)
json
Copier
Modifier
{
"jobId": "uuid",
"inputUrl": "https://s3.amazonaws.com/input.mp4",
"status": "PENDING" | "DONE" | "ERROR",
"outputUrl": "https://s3.amazonaws.com/output.webm",
"createdAt": "ISO timestamp",
"error": "string | null"
}
🧑‍💻 Lambda: submit.handler
Generate jobId (UUID)

Save jobId, inputUrl, status=PENDING, createdAt to DynamoDB

Push to SQS: { jobId, inputUrl }

🧑‍💻 Lambda: worker.handler
Receive job from SQS

Download video from input URL (via axios, https, or AWS SDK if S3)

Save to /tmp/input.mp4

Run FFmpeg via child_process

Save result to /tmp/output.webm

Upload to S3 with key like jobs/${jobId}.webm

Update DynamoDB status and output URL

🧑‍💻 Lambda: status.handler
Read job from DynamoDB

Return JSON with job status and outputUrl (if DONE)

✅ Example Workflow
Client calls POST /submit with:

json
Copier
Modifier
{ "inputUrl": "https://s3.amazonaws.com/your-input.mp4" }
Response:

json
Copier
Modifier
{ "jobId": "abc123", "status": "PENDING" }
Client polls GET /status/abc123 until:

json
Copier
Modifier
{ "status": "DONE", "outputUrl": "https://s3.amazonaws.com/your-output/abc123.webm" }
📌 Notes
Prefer .webm for transparency and compression

Use /tmp storage in Lambda (<512MB)

Use presigned URLs if input is not public

Consider gzip or transcoding if outputs are large

Add monitoring (e.g., CloudWatch, alerts on failure)
