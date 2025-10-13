"use server";

import axios from "axios";

const BACKEND_API_URL = process.env.BACKEND_API_URL!;

interface GetServicesListResponse {
  success: boolean;
  services?: string[];
  count?: number;
  error?: string;
  statusCode?: number;
}

export const getServicesList = async (): Promise<GetServicesListResponse> => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/get-service-list`, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    const data = response.data;

    return {
      success: true,
      services: data.services,
      count: data.count,
    };
  } catch (error) {
    console.error("Error fetching services list:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "Services list not found. Please check the configuration.",
          statusCode: 404,
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
      error: "Network error occurred while fetching services list",
    };
  }
};
