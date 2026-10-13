# AI Property Recommendation — Web Chat

React + TypeScript + Vite frontend; Node.js + TypeScript + Apollo GraphQL backend; Prisma/PostgreSQL; OpenAI tool calling. No embeddings or vector database.

## Run locally
1. Node.js 20+ and PostgreSQL required.
2. `npm install`
3. `cp backend/.env.example backend/.env`; set `OPENAI_API_KEY` and `DATABASE_URL`.
4. Replace `backend/prisma/schema.prisma` with your actual Prisma schema, or adapt the example model and `backend/src/propertySearch.ts`.
5. `cd backend && npx prisma generate && cd ..`
6. `npm run dev`
Frontend: http://localhost:5173; GraphQL: http://localhost:4000/graphql.

For an existing DB, use `cd backend && npx prisma db pull` against a safe dev connection, review schema, then `npx prisma generate`. Do not run migrations against production blindly.

## Example GraphQL
`query { askPropertyAssistant(message: "Find a 2 bedroom apartment in Jaipur under 6000000") }`

Price units must match your database (the example assumes rupees). The backend applies exact city/type filters, locality substring matching, and `status = Available`. Adapt those rules to your actual schema/status values.

## AWS
Lambda entry point: `backend/src/lambda.ts`, handler `dist/lambda.handler`, API Gateway HTTP API payload v2. Set `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL` (for Groq), `AWS_REGION`, and `DB_SECRET_ARN`. The Secrets Manager secret JSON must contain `username`, `password`, `host`, `port`, `dbname`, optionally `schema`. Grant `secretsmanager:GetSecretValue` to the Lambda role and configure VPC access if PostgreSQL is private. Use RDS Proxy for scale and ensure Prisma Client is generated for the Lambda runtime/architecture. Host the frontend on S3/CloudFront and set `VITE_GRAPHQL_URL` to the API URL. Configure CORS/auth/rate limits before public production use.

The sample `Property` model is illustrative because your real schema file was not attached. This is a starter scaffold, not a verified deployment. Add tests, authentication, observability, CORS allowlisting, and conversation storage for multi-turn follow-ups before production.
