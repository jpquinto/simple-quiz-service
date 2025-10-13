import {
  DynamoDBClient,
  UpdateItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const { SERVICE_BANK_TABLE_NAME, ID_STATUS_TABLE_NAME } = process.env;

export const updateServicesList = async (): Promise<void> => {
  if (!SERVICE_BANK_TABLE_NAME || !ID_STATUS_TABLE_NAME) {
    throw new Error("Required environment variables are not set");
  }

  try {
    // Fetch all service names from the service bank table
    const serviceNames: string[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      const scanCommand = new ScanCommand({
        TableName: SERVICE_BANK_TABLE_NAME,
        ProjectionExpression: "service_name",
        ExclusiveStartKey: lastEvaluatedKey,
      });

      const scanResult = await client.send(scanCommand);

      if (scanResult.Items) {
        for (const item of scanResult.Items) {
          const unmarshalled = unmarshall(item);
          if (unmarshalled.service_name) {
            serviceNames.push(unmarshalled.service_name);
          }
        }
      }

      lastEvaluatedKey = scanResult.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    // Sort the service names alphabetically
    serviceNames.sort();

    // Update the ID_STATUS_TABLE with the full services list
    const updateCommand = new UpdateItemCommand({
      TableName: ID_STATUS_TABLE_NAME,
      Key: marshall({
        metric_name: "full_services_list",
      }),
      UpdateExpression: "SET #list = :list, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#list": "list",
        "#updatedAt": "updated_at",
      },
      ExpressionAttributeValues: marshall({
        ":list": serviceNames,
        ":updatedAt": new Date().toISOString(),
      }),
    });

    await client.send(updateCommand);

    console.log(
      `Successfully updated full_services_list with ${serviceNames.length} services`
    );
  } catch (error) {
    console.error("Error updating services list:", error);
    throw error;
  }
};
