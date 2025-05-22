import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export const helloWorld = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Hello, world!" }),
  }
}
