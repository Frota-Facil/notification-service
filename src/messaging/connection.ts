import amqp, { Channel, Connection } from "amqplib";
import { RABBITMQ_AMQP_URL } from "@/config/env";

let connection: Connection;
let channel: Channel;

export async function connectRabbit() {
  try {
    connection = await amqp.connect(RABBITMQ_AMQP_URL);

    connection.on("error", (err) => {
      console.error(err, "❌ RabbitMQ connection error");
    });

    connection.on("close", () => {
      console.warn("⚠️ RabbitMQ connection closed");
    });

    channel = await connection.createChannel();

    console.info("📡 RabbitMQ conectado");

    return channel;
  } catch (err) {
    console.error(err, "❌ Falha ao conectar no RabbitMQ");
    throw err;
  }
}

export function getChannel() {
  if (!channel) {
    throw new Error("RabbitMQ não conectado");
  }
  return channel;
}