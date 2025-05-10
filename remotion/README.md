## Deploy function

npx remotion lambda functions deploy --disk 10240 --timeout 900

## Deploy Site

npx remotion lambda sites create src/index.ts --site-name=yourvideoengine

## Run render

npx remotion lambda render https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/blacksmith-shorts/index.html Demo --frames-per-lambda=12

## status

aws lambda get-function-configuration \
 --function-name renderVideo \
 --region us-east-1 \
 --query "LastUpdateStatus"

## log

aws logs tail /aws/lambda/renderVideo --since 5m --follow

## invoke

aws lambda invoke \
 --function-name renderVideo \
 --payload '{"body":"{\"serveUrl\":\"https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/blacksmith-shorts/index.html\",\"composition\":\"Demo\",\"inputProps\":{\"text\":\"test direct lambda\"}}"}' \
 --region us-east-1 \
 --cli-binary-format raw-in-base64-out \
 response.json

cat response.json

## curl

curl -X POST https://vn4gjkafoc.execute-api.us-east-1.amazonaws.com/ \
 -H "Content-Type: application/json" \
 -d '{
"serveUrl": "https://remotionlambda-useast1-xw8v2xhmyv.s3.us-east-1.amazonaws.com/sites/yourvideoengine/index.html",
"composition": "Captions",
"inputProps": {
"text": "dernier test ok ?"
}
}'

## notes

API ID : vn4gjkafoc

{
"ConnectionType": "INTERNET",
"IntegrationId": "ux2lja7",
"IntegrationMethod": "POST",
"IntegrationType": "AWS_PROXY",
"IntegrationUri": "arn:aws:lambda:us-east-1:339712823540:function:renderVideo",
"PayloadFormatVersion": "2.0",
"TimeoutInMillis": 30000
}
manu@Mac api %

## status lambda integration

integration id :: f7kraw4

aws apigatewayv2 create-route \
 --api-id vn4gjkafoc \
 --route-key 'GET /status' \
 --target integrations/f7kraw4 \
 --region us-east-1
