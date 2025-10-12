
export interface ServiceBankIngestionRecord {
    service_name: string;
    service_icon: string;
    description: string;
    tags: string[];
    difficulty: number;
    availability_scope: "global" | "regional" | "zonal";
    integrations: string[];
    related_services: string[];
    acronym: string;
}

export interface CurrentIds {
    service_name_table: number;
    acronym_table: number;
}