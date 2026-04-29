import { buildApp } from "@/app";
import { env } from "@/config/env";
import { setupMessaging } from "@/messaging/setup";

async function bootstrap() {
  const app = buildApp();

  await setupMessaging();

  await app.listen({ port: 3331, host: "0.0.0.0" });
}

bootstrap();