
module "get_service_list_lambda" {
  source  = "./modules/lambda"
  context = module.null_label.context

  name            = "get-service-list-lambda"
  handler         = "handler.handler"
  source_dir      = "${path.root}/../backend/dist/user_api_gateway/get_service_list"
  build_path      = "${path.root}/../backend/build/user_api_gateway/get_service_list/get_service_list.zip"
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
  }
}

resource "aws_iam_policy" "get_service_list_policy" {
  name        = "get-service-list-policy"
  description = "Policy for get service list lambda."

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:*",
        ],
        Resource = [
            module.id_status_table.arn,
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_service_list_attach" {
  role       = module.get_service_list_lambda.role_name
  policy_arn = aws_iam_policy.get_service_list_policy.arn
}


