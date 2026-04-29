import { ConsumeMessage } from "amqplib";
import { getChannel } from "../connection";

export async function startNotificationConsumer() {
  const channel = getChannel();

  const QUEUE = "notification.solicitation.created";

  await channel.consume(
    QUEUE,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const event = JSON.parse(content);

        console.info({ event }, "📩 Evento recebido");

        // 👉 exemplo de uso
        const { to, payload } = event;
        console.log(to);
        console.log(payload);
        
        

        // aqui você vai chamar o mailer depois
        // await sendEmail(...)

        channel.ack(msg);
      } catch (err) {
        console.error(err, "❌ Erro ao processar mensagem");

        // NÃO dá ack → mensagem volta pra fila
      }
    }
  );

  console.info(`👂 Consumindo fila: ${QUEUE}`);
}