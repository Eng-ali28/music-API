import { Gender } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class ProfileDto {
  @IsString()
  @Length(2, 55)
  firstname: string;
  @IsString()
  @Length(2, 55)
  lastname: string;
  @IsEnum(Gender)
  gender: Gender;
  @IsInt()
  @Max(100)
  @Min(1)
  age: number;
  @IsString()
  country: string;
  @IsString()
  city: string;
  @IsString()
  address: string;
  @IsPhoneNumber()
  phone: string;
}
