import { connectRabbit, getChannel } from "./connection";
import { startNotificationConsumer } from "./consumers/notification-consumer";

export async function setupMessaging() {
  await connectRabbit();

  const channel = getChannel();

  const QUEUE = "notification.solicitation.created";

  await channel.assertQueue(QUEUE, {
    durable: true,
  });

  await startNotificationConsumer();
}