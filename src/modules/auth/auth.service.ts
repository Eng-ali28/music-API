import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import UserService from '../user/user.service';
import PrismaService from 'prisma/prisma.service';
import { SignupDto } from './dto/auth-signup.dto';
import { ProfileDto } from './dto/profile.dto';
import * as bcrypt from 'bcryptjs';
import { Auth } from 'src/common/classes/auth';
import { Role } from '@prisma/client';
import MailService from 'src/shared/mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import appConfig from 'src/config/app.config';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Injectable()
export default class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}
  async register(
    userInfo: SignupDto,
    profileInfo: ProfileDto,
    image?: string,
  ): Promise<unknown> {
    const { username, email, password } = userInfo;
    const { firstname, lastname, address, age, city, country, gender, phone } =
      profileInfo;
    // check if email exist
    const findEmail = await this.userService.findByEmail(email);
    if (findEmail)
      throw new BadRequestException(`email ${email} already exists`);
    const findUsername = await this.userService.findByUsername(username);
    if (findUsername)
      throw new BadRequestException(`username ${username} already exists`);
    let salt = await bcrypt.genSalt();
    let auth = new Auth(false, null, null);

    let user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: await this.userService.hashPassword(password, salt),
        salt,
        AUTH: { ...auth },
        role: Role.USER,
        profile: {
          create: {
            firstName: firstname,
            lastName: lastname,
            address,
            age,
            city,
            country,
            gender,
            image,
            phone,
            favorite: { create: {} },
          },
        },
      },
    });
    await this.createEmailToken(user.email);
    await this.sendEmailVerfication(user.email);
    return user;
  }
  async createEmailToken(email: string) {
    // check if email verified exist with this email
    const emailVerified = await this.prisma.emailVerfication.findUnique({
      where: { email },
    });
    // if exist check if the time == (new Date().getTime() - emailVerified.timeStamp.getTime()) / 60000 < 15
    if (
      emailVerified &&
      (new Date().getTime() - emailVerified.timeStamp.getTime()) / 60000 < 15
    ) {
      // if true => your email verfication sent recently, check your email.
      throw new BadRequestException(
        'Your email verification sent recently, please check your email',
      );
    } else {
      // if false => create email verfication with email and generate token(Math.floor(Math.random() * 900000) + 100000).toString()
      const newEmailVerification = await this.prisma.emailVerfication.create({
        data: {
          email,
          emailToken: (Math.floor(Math.random() * 900000) + 100000).toString(),
        },
      });
      return true;
    }
  }
  async sendEmailVerfication(email: string) {
    // get email verified by email
    const getEmailVerified = await this.prisma.emailVerfication.findUnique({
      where: { email },
    });
    // check if exist and has token ? true => send email with token : false => throw error register user not registered
    if (getEmailVerified) {
      return this.mailService
        .sendUserEmailVerficiation(email, getEmailVerified.emailToken)
        .then((info) => {
          console.log(info);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      throw new BadRequestException('REGISTER_USER_NOT_REGISTERED');
    }
  }
  async emailVerify(token: string) {
    // get email verified by token
    const findEmailVerified = await this.prisma.emailVerfication.findFirst({
      where: { emailToken: token },
    });
    // check if exist and has email == get user and make verified true and remove email verified
    if (findEmailVerified && findEmailVerified.email) {
      const findUser = await this.prisma.user.findUnique({
        where: { email: findEmailVerified.email },
      });
      if (findUser) {
        const verifiedUser = await this.prisma.user.update({
          where: { email: findUser.email },
          data: { AUTH: { ...new Auth(true, null, null) } },
        });
        await this.prisma.emailVerfication.delete({
          where: { email: findUser.email },
        });
        return verifiedUser;
      }
      // false throw error login email code is not valid
    } else throw new ForbiddenException('login email code is not valid');
  }

  async login(loginDto: LoginDto, res: Response) {
    // check if user is exists with email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) throw new ForbiddenException('email or password incorrect');
    // compare password
    const isEqual = await bcrypt.compare(loginDto.password, user.password);
    if (!isEqual) throw new ForbiddenException('email or password incorrect');
    // generate token and add payload
    let token = await this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    // set password in cookie
    res.cookie('token', token, { httpOnly: true });
    // return access token and user
    res.status(200).json({ accessToken: token, user });
  }

  // send email with token
  async sendEmailResetPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`User ${user} not found`);
    const forgottenPassword = await this.createResetToken(email);
    if (forgottenPassword && forgottenPassword.token) {
      await this.mailService.sendResetPassEmail(
        email,
        forgottenPassword.token,
        user.username,
      );
    } else throw new BadRequestException(`WRONG_PASSWORD_CHANGE_TOKEN`);
  }
  // create email token
  async createResetToken(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`User ${user} not found`);
    const forgottenPassword = await this.prisma.forgottenPassword.findUnique({
      where: { email },
    });

    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.timeStamp.getTime()) / 60000 <
        15
    ) {
      throw new BadRequestException(
        'your email with reset password sent recently',
      );
    } else {
      let newResetToken = await this.prisma.forgottenPassword.create({
        data: {
          email,
          token: (Math.floor(Math.random() * 900000) + 100000).toString(),
        },
      });
      return newResetToken;
    }
  }
  // check password
  async checkPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`User ${user} not found`);
    return await bcrypt.compare(password, user.password);
  }
  // set new password current or forgotten password
  async setPassword(data: ResetPasswordDto) {
    let isPasswordChanged = false;
    let { email, newPassword, currentPassword, token } = data;
    if (email && currentPassword) {
      let isValidPassword = await this.checkPassword(email, currentPassword);
      // update password the current password is true
      if (isValidPassword) {
      } else {
        throw new BadRequestException('current password is incorrect');
      }
    } else if (token) {
      // find reset password by token
      const resetPassword = await this.prisma.forgottenPassword.findUnique({
        where: { token },
      });
      // toggle isPasswordChanged
      isPasswordChanged = await this.setPasswordDB(
        resetPassword.email,
        newPassword,
      );
      if (isPasswordChanged) {
        await this.prisma.forgottenPassword.delete({ where: { email } });
      }
    }
  }
  // set password in db
  async setPasswordDB(email: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(`User ${user} not found`);
    await this.prisma.user.update({
      where: { email },
      data: { password: await bcrypt.hash(newPassword, user.salt) },
    });
    return true;
  }
}
