import { fastify } from "fastify";
import { collectDefaultMetrics, register } from "prom-client";
import { logger } from "@/globals/logger";

collectDefaultMetrics();

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

  app.get("/metrics", async (_request, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });

  return app;
}
