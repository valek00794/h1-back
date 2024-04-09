import { emailAdapter } from "../adapters/email-adatper"
import { SETTINGS } from "../settings"

export const emailManager = {
    async sendEmailConfirmationMessage(email: string, code: string) {
        const subject = 'Email confirmation'
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href=\'http://localhost:${SETTINGS.PORT}/auth/registration-confirmation?code=${code}\'> complete registration</a></p>`
        emailAdapter.send(email, subject, message)
    }
}