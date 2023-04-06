import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import AuthService from './auth.service';
import { SignupDto } from './dto/auth-signup.dto';
import { ProfileDto } from './dto/profile.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { Role } from '@prisma/client';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}
  //Post register
  @Post('register')
  async signup(
    @Body('SignupDto') signUpData: SignupDto,
    @Body('ProfileDto') profileData: ProfileDto,
  ) {
    return await this.authService.register(signUpData, profileData);
  }
  //Get email-verify/:token
  @Get('email-verify/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.emailVerify(token);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return await this.authService.login(loginDto, res);
  }

  @Post('forget-password/:email')
  async sendEmailResetPassword(@Param('email') email: string) {
    return await this.sendEmailResetPassword(email);
  }
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {}
}
