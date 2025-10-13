import {
  addServicesToAcronymTable,
  addServicesToServicesTable,
} from "./utils/add_services_to_dynamo";
import { getCurrentIds } from "./utils/get_current_ids";
import { getCurrentIngestionFile } from "./utils/get_current_ingestion_file";
import { updateCurrentIds } from "./utils/update_current_id";
import { updateServicesList } from "./utils/update_services_list";

/**
 * Lambda handler for S3 events.
 * It logs the entire incoming S3 event object.
 * * @param {object} event - The S3 event object that triggered the Lambda function.
 * @param {object} context - The Lambda runtime context object.
 */
export const handler = async (event: any, context: any) => {
  console.log("Service bank ingestor handler executed");

  if (event.Records && event.Records.length > 0) {
    for (const record of event.Records) {
      if (record.s3) {
        const bucketName = record.s3.bucket.name;
        const objectKey = decodeURIComponent(
          record.s3.object.key.replace(/\+/g, " ")
        );
        const eventName = record.eventName;

        console.log(`--- Record Detail ---`);
        console.log(`Event Name: ${eventName}`);
        console.log(`Bucket Name: ${bucketName}`);
        console.log(`Object Key: ${objectKey}`);
        console.log(`---------------------`);

        try {
          // Get and process the ingestion file
          const services = await getCurrentIngestionFile(objectKey);
          console.log(
            `Successfully retrieved ${services.length} services from ${objectKey}`
          );

          // Get current IDs
          const currentIds = await getCurrentIds();

          console.log(
            `Current IDs - Service Name Table: ${currentIds.service_name_table}, Acronym Table: ${currentIds.acronym_table}`
          );

          // Update the databases with the new services
          const nextServiceTableId = await addServicesToServicesTable({
            services,
            currentIds,
          });
          console.log(
            `Added services to Services Table. Next ID: ${nextServiceTableId}`
          );

          const nextAcronymTableId = await addServicesToAcronymTable({
            services,
            currentIds,
          });
          console.log(
            `Added services to Acronym Table. Next ID: ${nextAcronymTableId}`
          );

          // Update the current IDs in the ID status table
          await updateCurrentIds({
            service_name_table: nextServiceTableId,
            acronym_table: nextAcronymTableId,
          });
          console.log(`Successfully updated current IDs in ID status table`);

          // Update the full services list
          await updateServicesList();
          console.log(`Successfully updated full services list`);
        } catch (error) {
          console.error(`Error processing file ${objectKey}:`, error);
          throw error; // Re-throw to mark Lambda execution as failed
        }
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Service bank ingestor executed successfully",
    }),
  };
};
