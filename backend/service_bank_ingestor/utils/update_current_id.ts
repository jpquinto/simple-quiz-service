import { CurrentIds } from "../types";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const { ID_STATUS_TABLE_NAME } = process.env;

export const updateCurrentIds = async (next_ids: CurrentIds): Promise<void> => {
  const updates = [
    {
      metric_name: "service_name_table",
      current_id: next_ids.service_name_table,
    },
    { metric_name: "acronym_table", current_id: next_ids.acronym_table },
  ];

  for (const update of updates) {
    const command = new UpdateItemCommand({
      TableName: ID_STATUS_TABLE_NAME!,
      Key: marshall({
        metric_name: update.metric_name,
      }),
      UpdateExpression: "SET current_id = :currentId",
      ExpressionAttributeValues: marshall({
        ":currentId": update.current_id,
      }),
    });

    await client.send(command);
  }
};
