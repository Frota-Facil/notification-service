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
        const status = event?.data?.status;

        let text: string;

        if (typeof payload === "string") {
          text = payload;
        } else {
          const name = event?.data?.userName ?? payload?.name ?? "";
          const message = event?.message ?? payload?.message ?? "";

          const vehicle = event?.data?.vehicleName ?? "";
          const plate = event?.data?.vehiclePlate ?? "";
          const reason = event?.data?.reason ?? "";
          const startsAt = event?.data?.startsAt
            ? new Date(event.data.startsAt).toLocaleString("pt-BR")
            : "";
          const endsAt = event?.data?.endsAt
            ? new Date(event.data.endsAt).toLocaleString("pt-BR")
            : "";

          const details = `
        🚗 Veículo: ${vehicle}
        🔖 Placa: ${plate}
        📄 Motivo: ${reason}
        📅 Início: ${startsAt}
        📅 Fim: ${endsAt}
        `;

          if (status === "approved") {
            text = `Olá, ${name}!

        ✅ Sua solicitação foi APROVADA com sucesso.

        ${details}

        📌 Detalhes adicionais:
        ${message}

        Boa viagem! 🚀`;
          } else if (status === "rejected") {
            text = `Olá, ${name}!

        ❌ Sua solicitação foi RECUSADA.

        ${details}

        📌 Motivo / Observação:
        ${message}

        Caso tenha dúvidas, entre em contato com o administrador.`;
          } else {
            // pending ou fallback
            text = `Olá, ${name}!

        📌 Pedido de solicitação criado.

        ${details}

        Agora você pode aprovar ou negar essa solicitação de veículo no seu dashboard!`;
          }
        }

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