import { PrismaClient } from "./generated/prisma/client";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { config } from "./config";
let prisma: PrismaClient | undefined;
type Secret = { username: string; password: string; host: string; port?: number; dbname: string; schema?: string };
async function dbUrl(): Promise<string> {
  if (!config.secretArn) return config.databaseUrl;
  const sm = new SecretsManagerClient({ region: config.region });
  const result = await sm.send(new GetSecretValueCommand({ SecretId: config.secretArn }));
  if (!result.SecretString) throw new Error("DB secret has no SecretString");
  const s = JSON.parse(result.SecretString) as Secret;
  if (!s.username || !s.password || !s.host || !s.dbname) throw new Error("Secret needs username/password/host/dbname");
  return `postgresql://${encodeURIComponent(s.username)}:${encodeURIComponent(s.password)}@${s.host}:${s.port ?? 5432}/${encodeURIComponent(s.dbname)}?schema=${encodeURIComponent(s.schema ?? "public")}&connection_limit=3`;
}
export async function getPrisma() {
  if (!prisma) prisma = new PrismaClient({ datasources: { db: { url: await dbUrl() } } });
  return prisma;
}
