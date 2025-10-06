module "aws_service_bucket" {
  source = "./modules/s3_bucket"
  name   = "aws-service-bucket"

  context = module.null_label.context

  force_destroy = true

  enable_bucket_versioning      = false
  enable_server_side_encryption = false

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  enable_website_configuration = false
  lifecycle_config             = "true"
}

resource "aws_lambda_permission" "allow_s3_to_invoke_ingestor" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.service_bank_ingestor_lambda.name
  principal     = "s3.amazonaws.com"
  
  source_arn    = module.aws_service_bucket.bucket_arn
}

resource "aws_s3_bucket_notification" "service_bank_ingestor_trigger" {
  bucket = module.aws_service_bucket.bucket_id 

  lambda_function {
    lambda_function_arn = module.service_bank_ingestor_lambda.arn 
    
    events = ["s3:ObjectCreated:*"] 

    filter_suffix = ".json" 
  }

  depends_on = [
    aws_lambda_permission.allow_s3_to_invoke_ingestor,
  ]
}