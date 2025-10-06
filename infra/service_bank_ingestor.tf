
module "service_bank_ingestor_lambda" {
  source  = "./modules/lambda"
  context = module.null_label.context

  name            = "service-bank-ingestor-lambda"
  handler         = "handler.handler"
  source_dir      = "${path.root}/../backend/dist/service_bank_ingestor"
  build_path      = "${path.root}/../backend/build/service_bank_ingestor/service_bank_ingestor.zip"
  runtime         = "nodejs20.x"
  memory          = 256
  time_limit      = 60
  deployment_type = "zip"
  zip_project     = true

  create_sg                   = false
  enable_vpc_access           = false
  ipv6_allowed_for_dual_stack = false

  environment_variables = {
    REGION : var.aws_region
    AWS_ACCOUNT_ID : local.account_id
    SERVICE_BANK_BUCKET_NAME : module.aws_service_bucket.bucket_name
    ID_STATUS_TABLE_NAME : module.id_status_table.name
    SERVICE_BANK_TABLE_NAME : module.aws_service_bank_table.name
  }
}

resource "aws_iam_policy" "service_bank_ingestor_policy" {
  name        = "service-bank-ingestor-policy"
  description = "Policy for service bank ingestor lambda."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:*",
        ],
        Resource = [
            module.aws_service_bank_table.arn,
            module.id_status_table.arn
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:GetObjectAcl",
          "s3:DeleteObject"
        ],
        Resource = ["${module.aws_service_bucket.bucket_arn}/*"]
      },
      {
        Effect = "Allow",
        Action = [
          "s3:ListBucket",
        ],
        Resource = [module.aws_service_bucket.bucket_arn]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "service_bank_ingestor_attach" {
  role       = module.service_bank_ingestor_lambda.role_name
  policy_arn = aws_iam_policy.service_bank_ingestor_policy.arn
}


