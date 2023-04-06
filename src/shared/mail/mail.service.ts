import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import appConfig from 'src/config/app.config';

@Injectable()
export default class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserEmailVerficiation(email: string, token: string) {
    const url = `${appConfig().frontendAndKeys.host}/${
      appConfig().frontendAndKeys.endPoints[1]
    }`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome! Confirm your Email',
      template: './verification',
      context: {
        name: 'customer',
        url,
      },
    });
  }
}
