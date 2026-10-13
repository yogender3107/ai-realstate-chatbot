import { startServerAndCreateLambdaHandler, handlers } from "@as-integrations/aws-lambda";
import { apollo } from "./graphql";
import { validateConfig } from "./config";
validateConfig();
export const handler = startServerAndCreateLambdaHandler(
  apollo, handlers.createAPIGatewayProxyEventV2RequestHandler()
);
