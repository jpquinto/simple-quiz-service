import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const { ID_STATUS_TABLE_NAME } = process.env;

const client = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!ID_STATUS_TABLE_NAME) {
      throw new Error("ID_STATUS_TABLE_NAME environment variable is not set");
    }

    // Fetch the full_services_list from DynamoDB
    const getItemCommand = new GetItemCommand({
      TableName: ID_STATUS_TABLE_NAME,
      Key: {
        metric_name: { S: "full_services_list" },
      },
    });

    const result = await client.send(getItemCommand);

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Services list not found",
        }),
      };
    }

    const unmarshalled = unmarshall(result.Item);
    const servicesList = unmarshalled.list || [];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        services: servicesList,
        count: servicesList.length,
      }),
    };
  } catch (error) {
    console.error("Error fetching services list:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to fetch services list",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
