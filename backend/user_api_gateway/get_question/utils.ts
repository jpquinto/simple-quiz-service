import {
  DynamoDBClient,
  QueryCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});

export const getCurrentId = async (
  tableName: string,
  metricName: string
): Promise<number> => {
  const queryCommand = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "metric_name = :metricName",
    ExpressionAttributeValues: marshall({
      ":metricName": metricName,
    }),
  });

  const response = await client.send(queryCommand);

  if (response.Items && response.Items.length > 0) {
    const item = unmarshall(response.Items[0]);
    return item.current_id;
  } else {
    throw new Error(`No current_id found for metric_name: ${metricName}`);
  }
};

export const getQuestion = async (
  tableName: string,
  id: string
): Promise<any> => {
  const getItemCommand = new GetItemCommand({
    TableName: tableName,
    Key: marshall({
      service_id: id,
    }),
  });

  const response = await client.send(getItemCommand);

  if (response.Item) {
    return unmarshall(response.Item);
  } else {
    throw new Error(
      `No item found with service_id: ${id} in table: ${tableName}`
    );
  }
};
