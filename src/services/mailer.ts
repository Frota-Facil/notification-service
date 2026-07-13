import nodemailer from "nodemailer";
import { env } from "@/config/env";

export async function sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: false
    })

    const info = await transporter.sendMail({
        from: 'adminsif@email.com',
        to,
        subject,
        text
    })

    console.log('📨 Email enviado:', info.messageId)
}
