import { createRequire } from "node:module";

// Load .env locally when available, but do not fail in hosted build environments.
try {
  const require = createRequire(import.meta.url);
  require("dotenv/config");
} catch {
  // Ignore missing dotenv in production build environments.
}
import { defineConfig } from "prisma/config";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
