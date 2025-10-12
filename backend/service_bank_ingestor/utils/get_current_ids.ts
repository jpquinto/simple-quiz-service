import { CurrentIds } from "../types";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const { ID_STATUS_TABLE_NAME } = process.env;

export const getCurrentIds = async (): Promise<CurrentIds> => {
  const metricNames = ["service_name_table", "acronym_table"];
  const results: Partial<CurrentIds> = {};

  for (const metricName of metricNames) {
    const queryCommand = new QueryCommand({
      TableName: ID_STATUS_TABLE_NAME!,
      KeyConditionExpression: "metric_name = :metricName",
      ExpressionAttributeValues: marshall({
        ":metricName": metricName,
      }),
    });

    const response = await client.send(queryCommand);

    if (response.Items && response.Items.length > 0) {
      const item = unmarshall(response.Items[0]);
      results[metricName as keyof CurrentIds] = item.current_id;
    } else {
      throw new Error(`No current_id found for metric_name: ${metricName}`);
    }
  }

  return {
    service_name_table: results.service_name_table!,
    acronym_table: results.acronym_table!,
  };
};
