import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    private logger = new Logger(MailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordEmail(to: string, password: string) {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to,
            subject: 'Tài khoản mới của bạn',
            html: `
            <p>Chào bạn,</p>
            <p>Tài khoản của bạn đã được tạo tự động.</p>
            <p><strong>Email:</strong> ${to}</p>
            <p><strong>Mật khẩu tạm thời:</strong> <code>${password}</code></p>
            <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay.</p>
            `,
        };


        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Mail sent: ${info.message}`);
            return info;
        }
        catch(err)
        {
            this.logger.error('Error sending mail', err);
            throw err;
        }
    }
}
