import "dotenv/config";

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
}

export const config = {
    databaseUrl: requireEnv("DATABASE_URL"),
    port: process.env["PORT"] ?? "3000",
};
