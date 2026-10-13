export const config = {
  port: Number(process.env.PORT ?? 4000),
  provider: (process.env.AI_PROVIDER ?? "groq").toLowerCase(),
  apiKey: process.env.AI_API_KEY ?? process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
  model: process.env.AI_MODEL ?? (process.env.AI_PROVIDER === "openai" ? "gpt-4.1-mini" : "openai/gpt-oss-20b"),
  baseURL: process.env.AI_BASE_URL ?? (process.env.AI_PROVIDER === "openai" ? undefined : "https://api.groq.com/openai/v1"),
  region: process.env.AWS_REGION ?? "ap-south-1",
  secretArn: process.env.DB_SECRET_ARN ?? "",
  databaseUrl: process.env.DATABASE_URL ?? ""
};
export function validateConfig() {
  if (!config.apiKey) throw new Error("Set AI_API_KEY (or GROQ_API_KEY / OPENAI_API_KEY).");
  if (!config.secretArn && !config.databaseUrl) throw new Error("Set DB_SECRET_ARN or DATABASE_URL");
  if (!["groq", "openai"].includes(config.provider) && !process.env.AI_BASE_URL) {
    throw new Error("AI_PROVIDER must be groq or openai unless AI_BASE_URL is set.");
  }
}
