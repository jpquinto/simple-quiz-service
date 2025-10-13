import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getCurrentId, getQuestionsBatch } from "./utils";

const {
  ID_STATUS_TABLE_NAME,
  SERVICE_BANK_TABLE_NAME,
  ACRONYM_BANK_TABLE_NAME,
} = process.env;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Get the type from query parameters
    const type = event.queryStringParameters?.type;

    if (!type || (type !== "service" && type !== "acronym")) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Invalid or missing 'type' query parameter. Must be 'service' or 'acronym'",
        }),
      };
    }

    // Get the count from query parameters (default to 10)
    const count = parseInt(event.queryStringParameters?.count || "10");

    if (count < 1 || count > 50) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Count must be between 1 and 50",
        }),
      };
    }

    // Get previously answered question IDs from query parameters
    const excludeIdsParam = event.queryStringParameters?.exclude_ids;
    const excludeIds = new Set<number>();

    if (excludeIdsParam) {
      try {
        // Parse comma-separated IDs or JSON array
        const parsedIds = excludeIdsParam.includes("[")
          ? JSON.parse(excludeIdsParam)
          : excludeIdsParam.split(",");

        parsedIds.forEach((id: string | number) => {
          const numId = typeof id === "string" ? parseInt(id.trim()) : id;
          if (!isNaN(numId)) {
            excludeIds.add(numId);
          }
        });
      } catch (error) {
        console.error("Error parsing exclude_ids:", error);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message:
              "Invalid exclude_ids format. Use comma-separated numbers or JSON array.",
          }),
        };
      }
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

    // Check if there are enough available questions
    const availableQuestions = currentId - excludeIds.size;
    if (availableQuestions < count) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Not enough questions available. Requested: ${count}, Available: ${availableQuestions}`,
        }),
      };
    }

    // Generate multiple random IDs
    const usedIds = new Set<number>(excludeIds);
    const ids: string[] = [];

    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loops

    while (ids.length < count && attempts < maxAttempts) {
      const randomId = Math.floor(Math.random() * currentId) + 1;

      if (!usedIds.has(randomId)) {
        usedIds.add(randomId);
        ids.push(randomId.toString());
      }

      attempts++;
    }

    if (ids.length < count) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Could not generate enough unique question IDs",
        }),
      };
    }

    // Batch fetch all questions
    const questions = await getQuestionsBatch(tableName, ids);

    if (questions.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No questions could be fetched",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        questions,
        count: questions.length,
      }),
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
