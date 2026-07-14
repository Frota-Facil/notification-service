import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        host: '52.176.18.186',
        port: 1025,
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