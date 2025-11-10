import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserPassword(email: string, password: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome! Your temporary password',
      html: `
        <h2>Hi ${name}, welcome to our app 🎉</h2>
        <p>Your temporary password is: <b>${password}</b></p>
        <p>Please log in and change it as soon as possible.</p>
      `,
    });
  }
}
