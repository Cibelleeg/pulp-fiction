import { createRequire } from "node:module";

try {
    const require = createRequire(import.meta.url);
    require("dotenv/config");
} catch {
    // Ignore missing dotenv when environment variables are provided by the host.
}

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
}

export const config = {
    databaseUrl: requireEnv("DATABASE_URL"),
    port: process.env["PORT"] ?? "3000",
    jwtSecret: requireEnv("JWT_SECRET"),
    minimoAvaliacoesRanking: Number(process.env["MINIMO_AVALIACOES_RANKING"] ?? 5),

};
