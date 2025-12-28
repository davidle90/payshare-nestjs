import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const url = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    return url;

    /*
    await this.transporter.sendMail({
        from: '"My App" <no-reply@myapp.com>',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click <a href="${url}">here</a> to verify your email.</p>`,
    } as nodemailer.SendMailOptions);
     */
  }
}
