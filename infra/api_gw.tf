module "aws-quiz-game-api" {
  source  = "./modules/api_gw"
  context = module.null_label.context

  api_name   = "aws-quiz-game-api"
  stage_name = "prod"

  http_routes = [
    {
      http_method          = "GET"
      path                 = "get-question"
      integration_type     = "lambda"
      lambda_invoke_arn    = module.get_question_lambda.invoke_arn
      lambda_function_name = module.get_question_lambda.name
      enable_cors_all      = true
      use_authorizer       = false # TODO: Enable when auth is ready
    },
  ]
  authorizer_type = "COGNITO_USER_POOLS"
  api_type        = ["REGIONAL"]
}
