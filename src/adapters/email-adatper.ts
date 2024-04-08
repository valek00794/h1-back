import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const emailAdapter = {
    async send(email: string, subject: string, message: string): Promise<SMTPTransport.SentMessageInfo> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.PASS_SENDER,
            },
        })

        const info = await transporter.sendMail({
            from: `${subject}  <${process.env.EMAIL_SENDER}>`,
            to: email,
            subject: subject,
            html: message
        })
        console.log(info)
        return info
    }
}