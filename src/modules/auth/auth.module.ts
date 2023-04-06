import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import appConfig from 'src/config/app.config';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import PrismaModule from 'prisma/prisma.module';
import UserModule from '../user/user.module';
import MailModule from 'src/shared/mail/mail.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: appConfig().defaultStrategy,
      session: false,
    }),
    JwtModule.register({
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: appConfig().expirationToken },
    }),
    PrismaModule,
    UserModule,
    MailModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export default class AuthModule {}
