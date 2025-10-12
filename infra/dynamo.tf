module "aws_service_bank_table" {
  source  = "./modules/dynamodb_table"
  context = module.null_label.context

  name = "aws-service-bank"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "service_id"

  attributes = [
    {
      name = "service_id"
      type = "S"
    }
  ]
}

module "aws_acronym_bank_table" {
  source  = "./modules/dynamodb_table"
  context = module.null_label.context

  name = "aws-acronym-bank"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "service_id"

  attributes = [
    {
      name = "service_id"
      type = "S"
    }
  ]
}

module "id_status_table" {
  source  = "./modules/dynamodb_table"
  context = module.null_label.context

  name = "aws-service-id-status"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "metric_name"

  attributes = [
    {
      name = "metric_name"
      type = "S"
    }
  ]
}
