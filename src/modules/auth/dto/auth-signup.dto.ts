import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(3, 55)
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 64)
  password: string;
}
