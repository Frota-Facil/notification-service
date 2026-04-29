import { fastify } from "fastify";
import { logger } from "@/globals/logger";

export function buildApp() {
    const app = fastify({
        logger: {
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: "HH:MM:ss Z",
                },
            },
        },
    });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  return app;
}