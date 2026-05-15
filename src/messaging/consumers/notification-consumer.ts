import { ConsumeMessage } from "amqplib";
import { getChannel } from "../connection";
import { sendEmail } from "@/services/mailer";

export async function startNotificationConsumer() {
  const channel = getChannel();

  const QUEUE = "notification.solicitation.created";
  await channel.assertQueue(QUEUE, { durable: true }); // Garantindo que a fila exista e seja durável
  await channel.consume(
    QUEUE,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const event = JSON.parse(content);

        console.info({ event }, "📩 Evento recebido");

        // 👉 exemplo de uso
        const { to, payload, recipients, subject } = event;
        
        // 🔹 Define lista de destinatários (novo + compatibilidade antiga)
        const emailList = recipients ?? (to ? [to] : []);

        if (emailList.length === 0) {
          throw new Error("Nenhum destinatário informado");
        }
        
        // 🔹 Define conteúdo do email
      const emailSubject = subject ?? "Atualização de solicitação";

      for (const email of emailList) {
        const text =
          typeof payload === "string"
            ? payload
            : `Olá, ${payload.nome ?? ""},\n\n${payload.message ?? ""}`;

        await sendEmail(email, emailSubject, text);
      }

        channel.ack(msg);
      } catch (err) {
        console.error(err, "❌ Erro ao processar mensagem");
        // channel.nack(msg, false, false); // descarta mensagem com erro
        // NÃO dá ack → mensagem volta pra fila
      }
    }
  );

  console.info(`👂 Consumindo fila: ${QUEUE}`);
}