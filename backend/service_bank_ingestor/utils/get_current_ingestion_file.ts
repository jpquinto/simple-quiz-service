import { ServiceBankIngestionRecord } from "../types";
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";

const S3_CLIENT = new S3Client({});
const { SERVICE_BANK_BUCKET_NAME } = process.env;

export const getCurrentIngestionFile = async (
  s3Key: string
): Promise<ServiceBankIngestionRecord[]> => {
  const getObjectParams: GetObjectCommandInput = {
    Bucket: SERVICE_BANK_BUCKET_NAME!,
    Key: s3Key,
  };

  const command = new GetObjectCommand(getObjectParams);
  const response = await S3_CLIENT.send(command);

  const bodyContents = await response.Body?.transformToString();

  if (!bodyContents) {
    throw new Error("Empty response body from S3");
  }

  const parsedData = JSON.parse(bodyContents);

  return parsedData.services as ServiceBankIngestionRecord[];
};
