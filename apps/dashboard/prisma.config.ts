import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx prisma generate && tsx prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
