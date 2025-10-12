import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getCurrentId, getQuestion } from "./utils";

const {
  ID_STATUS_TABLE_NAME,
  SERVICE_BANK_TABLE_NAME,
  ACRONYM_BANK_TABLE_NAME,
} = process.env;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get the type from headers
    const type = event.headers["type"] || event.headers["Type"];

    if (!type || (type !== "service" && type !== "acronym")) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid or missing 'type' header. Must be 'service' or 'acronym'",
        }),
      };
    }

    // Determine table name and metric name based on type
    const tableName =
      type === "service" ? SERVICE_BANK_TABLE_NAME! : ACRONYM_BANK_TABLE_NAME!;
    const metricName =
      type === "service" ? "service_name_table" : "acronym_table";

    // Get the current ID
    const currentId = await getCurrentId(ID_STATUS_TABLE_NAME!, metricName);

    if (currentId <= 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No questions available in the database",
        }),
      };
    }

    // Generate a random ID between 1 and currentId - 1
    const randomId = Math.floor(Math.random() * currentId) + 1;

    // Get the question
    const question = await getQuestion(tableName, randomId.toString());

    return {
      statusCode: 200,
      body: JSON.stringify({
        question,
      }),
    };
  } catch (error) {
    console.error("Error fetching question:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
