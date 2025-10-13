import {
  DynamoDBClient,
  QueryCommand,
  GetItemCommand,
  BatchGetItemCommand,
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

export const getQuestionsBatch = async (
  tableName: string,
  ids: string[]
): Promise<any[]> => {
  // DynamoDB BatchGetItem supports up to 100 items per request
  const BATCH_SIZE = 100;
  const allQuestions: any[] = [];

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batchIds = ids.slice(i, i + BATCH_SIZE);

    const keys = batchIds.map((id) =>
      marshall({
        service_id: id,
      })
    );

    const batchGetCommand = new BatchGetItemCommand({
      RequestItems: {
        [tableName]: {
          Keys: keys,
        },
      },
    });

    const response = await client.send(batchGetCommand);

    if (response.Responses && response.Responses[tableName]) {
      const questions = response.Responses[tableName].map((item) =>
        unmarshall(item)
      );
      allQuestions.push(...questions);
    }
  }

  return allQuestions;
};
