import "dotenv/config";
import { startStandaloneServer } from "@apollo/server/standalone";
import { apollo } from "./graphql";
import { config, validateConfig } from "./config";
async function main() {
  validateConfig();
  const {url} = await startStandaloneServer(apollo,{listen:{port:config.port}});
  console.log(`GraphQL API ready at ${url}`);
}
main().catch(e => { console.error(e); process.exit(1); });
