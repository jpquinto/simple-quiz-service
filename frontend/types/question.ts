

export interface Question {
    service_id: string;
    acronym?: string;
    availability_scope: "global" | "regional" | "zonal";
    description: string;
    difficulty: number;
    integrations: string[];
    related_services: string[];
    service_icon: string;
    service_name: string;
    tags: string[];
    link_to_amazon: string;
}

export interface GetQuestionsResponse {
    questions?: Question[];
    count?: number;
    success: boolean;
    error?: string;
    statusCode?: number;
}