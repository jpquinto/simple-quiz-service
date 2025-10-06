/**
 * Lambda handler for S3 events.
 * It logs the entire incoming S3 event object.
 * * @param {object} event - The S3 event object that triggered the Lambda function.
 * @param {object} context - The Lambda runtime context object.
 */
export const handler = async (event: any, context: any) => {
  console.log("Service bank ingestor handler executed");

  // Print the entire S3 event object for inspection
  console.log("Incoming S3 Event (Key-Value Pairs):");
  console.log(JSON.stringify(event, null, 2));

  // S3 events can contain multiple records (e.g., for batching),
  // but typically have one. You can loop through them for more detail:
  if (event.Records && event.Records.length > 0) {
    event.Records.forEach((record: any) => {
      if (record.s3) {
        const bucketName = record.s3.bucket.name;
        const objectKey = record.s3.object.key;
        const eventName = record.eventName;

        console.log(`--- Record Detail ---`);
        console.log(`Event Name: ${eventName}`);
        console.log(`Bucket Name: ${bucketName}`);
        console.log(`Object Key: ${objectKey}`);
        console.log(`---------------------`);
      }
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Service bank ingestor executed successfully",
    }),
  };
};
