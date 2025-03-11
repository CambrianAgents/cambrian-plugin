import { SeiAgentKit } from "../src";
import * as dotenv from "dotenv";

dotenv.config();

function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["SEI_PRIVATE_KEY"];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
}

validateEnvironment();

const agent = new SeiAgentKit(
  process.env.SEI_PRIVATE_KEY!,
  {
    OPENAI_API_KEY: "",
  },
);
async function main(
  contract?: string) {
  try {
    

  }
 catch (err) {
    console.error(err);
    return null;
  }
}


if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}