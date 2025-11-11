import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordEmail(to: string, password: string, name?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your auto-generated password',
      text: `Hello ${name || 'User'},\n\nHere is your auto-generated password: ${password}\n\nPlease log in and change it as soon as possible.`,
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  }
}
