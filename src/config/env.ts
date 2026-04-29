import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	RABBITMQ_AMQP_HOST: z.string().default("localhost"),
	RABBITMQ_AMQP_PORT: z.coerce.number().default(5672),
	RABBITMQ_USER: z.string().min(1),
	RABBITMQ_PASS: z.string().min(1),
});

export const env = envSchema.parse(process.env);

export const RABBITMQ_AMQP_URL = `amqp://${env.RABBITMQ_USER}:${env.RABBITMQ_PASS}@${env.RABBITMQ_AMQP_HOST}:${env.RABBITMQ_AMQP_PORT}`;
