
module "get_question_lambda" {
  source  = "./modules/lambda"
  context = module.null_label.context

  name            = "get-question-lambda"
  handler         = "handler.handler"
  source_dir      = "${path.root}/../backend/dist/user_api_gateway/get_question"
  build_path      = "${path.root}/../backend/build/user_api_gateway/get_question/get_question.zip"
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
    ID_STATUS_TABLE_NAME : module.id_status_table.name
    SERVICE_BANK_TABLE_NAME : module.aws_service_bank_table.name
    ACRONYM_BANK_TABLE_NAME : module.aws_acronym_bank_table.name
  }
}

resource "aws_iam_policy" "get_question_policy" {
  name        = "get-question-policy"
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
            module.id_status_table.arn,
            module.aws_acronym_bank_table.arn
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_question_attach" {
  role       = module.get_question_lambda.role_name
  policy_arn = aws_iam_policy.get_question_policy.arn
}


