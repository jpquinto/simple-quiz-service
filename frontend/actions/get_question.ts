"use server";

import { GetQuestionsResponse } from "@/types/question";
import axios from "axios";

const BACKEND_API_URL = process.env.BACKEND_API_URL!;

export const getQuestions = async (
  type: string,
  count: number = 10,
  excludeIds: string[] = []
): Promise<GetQuestionsResponse> => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      type,
      count: count.toString(),
    });

    // Add exclude_ids if provided
    if (excludeIds.length > 0) {
      params.append("exclude_ids", excludeIds.join(","));
    }

    const response = await axios.get(
      `${BACKEND_API_URL}/get-question?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const data = response.data;

    return {
      success: true,
      questions: data.questions,
      count: data.count,
    };
  } catch (error) {
    console.error("Error fetching questions:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "API endpoint not found. Please check the configuration.",
          statusCode: 404,
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response.data?.message || "Invalid request format",
          statusCode: 400,
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          error: "Access forbidden. Please check your API credentials.",
          statusCode: 403,
        };
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
          statusCode: 429,
        };
      } else if (error.response?.status === 500) {
        return {
          success: false,
          error: "Server error occurred. Please try again later.",
          statusCode: 500,
        };
      } else {
        return {
          success: false,
          error:
            error.response?.data?.message || "An unexpected error occurred",
          statusCode: error.response?.status,
        };
      }
    }

    if (error instanceof Error && error.message.includes("timeout")) {
      return {
        success: false,
        error: "Request timed out. Please try again.",
      };
    }

    return {
      success: false,
      error: "Network error occurred while fetching questions",
    };
  }
};
