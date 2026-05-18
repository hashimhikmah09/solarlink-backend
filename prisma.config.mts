import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    // Tells Prisma to use npx tsx to execute your seed file
    seed: 'npx tsx --env-file=.env ./prisma/seed.ts',
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});