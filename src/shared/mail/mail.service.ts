import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import appConfig from 'src/config/app.config';

@Injectable()
export default class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserEmailVerficiation(email: string, token: string) {
    const url = `${appConfig().frontendAndKeys.host}/${
      appConfig().frontendAndKeys.endPoints[1]
    }/${token}`;
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
  async sendResetPassEmail(email: string, token: string, name: string) {
    const url = `${appConfig().frontendAndKeys.host}/${
      appConfig().frontendAndKeys.endPoints[0]
    }/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome! Reset your password',
      template: './forgotten-password',
      context: {
        name,
        url,
      },
    });
  }
}
