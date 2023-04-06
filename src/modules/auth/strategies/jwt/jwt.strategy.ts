import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import PrismaService from 'prisma/prisma.service';
import appConfig from 'src/config/app.config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.cookieExtractors]),
      ignoreExpiration: false,
      secretOrKey: appConfig().jwtSecret,
    });
  }

  private static cookieExtractors(req: Request) {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies['token'];
    }
    return null;
  }
  async validate(payload: any) {
    const { email } = payload;
    const findUser = await this.prisma.user.findUnique({ where: { email } });
    if (!findUser) throw new UnauthorizedException('User is Unauthorized');
    return payload;
  }
}
