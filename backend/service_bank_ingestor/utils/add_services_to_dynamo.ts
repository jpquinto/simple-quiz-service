import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { CurrentIds, ServiceBankIngestionRecord } from "../types";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const { SERVICE_BANK_TABLE_NAME, ACRONYM_BANK_TABLE_NAME } = process.env;

interface AddServicesParams {
  services: ServiceBankIngestionRecord[];
  currentIds: CurrentIds;
}

export const addServicesToServicesTable = async ({
  services,
  currentIds,
}: AddServicesParams): Promise<number> => {
  let currentId = currentIds.service_name_table;

  // DynamoDB BatchWriteItem supports up to 25 items per request
  const BATCH_SIZE = 25;

  for (let i = 0; i < services.length; i += BATCH_SIZE) {
    const batch = services.slice(i, i + BATCH_SIZE);

    const writeRequests = batch.map((service) => {
      const item = {
        service_id: currentId.toString(),
        ...service,
      };
      currentId++;

      return {
        PutRequest: {
          Item: marshall(item),
        },
      };
    });

    const command = new BatchWriteItemCommand({
      RequestItems: {
        [SERVICE_BANK_TABLE_NAME!]: writeRequests,
      },
    });

    await client.send(command);
  }

  return currentId;
};

export const addServicesToAcronymTable = async ({
  services,
  currentIds,
}: AddServicesParams): Promise<number> => {
  let currentId = currentIds.acronym_table;

  // Filter services that have a non-empty acronym
  const servicesWithAcronyms = services.filter(
    (service) => service.acronym && service.acronym.trim() !== ""
  );

  // DynamoDB BatchWriteItem supports up to 25 items per request
  const BATCH_SIZE = 25;

  for (let i = 0; i < servicesWithAcronyms.length; i += BATCH_SIZE) {
    const batch = servicesWithAcronyms.slice(i, i + BATCH_SIZE);

    const writeRequests = batch.map((service) => {
      const item = {
        service_id: currentId.toString(),
        type: "aws",
        ...service,
      };
      currentId++;

      return {
        PutRequest: {
          Item: marshall(item),
        },
      };
    });

    const command = new BatchWriteItemCommand({
      RequestItems: {
        [ACRONYM_BANK_TABLE_NAME!]: writeRequests,
      },
    });

    await client.send(command);
  }

  return currentId;
};
