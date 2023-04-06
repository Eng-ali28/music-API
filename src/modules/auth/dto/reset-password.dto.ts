import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  token?: string;
  @IsString()
  @Length(8, 64)
  newPassword: string;
  @IsOptional()
  @IsString()
  @Length(8, 64)
  currentPassword?: string;
}
