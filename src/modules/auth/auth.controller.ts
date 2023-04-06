import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import AuthService from './auth.service';
import { SignupDto } from './dto/auth-signup.dto';
import { ProfileDto } from './dto/profile.dto';

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
}
