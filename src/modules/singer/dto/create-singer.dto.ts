import { Artist, Gender } from '@prisma/client';
import { IsString, IsEnum, Length } from 'class-validator';

export class CreateSingerDto {
  @IsString()
  @Length(2, 36)
  name: string;
  @IsString()
  @Length(8, 3000)
  info: string;
  @IsEnum(Artist)
  type: Artist;
  @IsEnum(Gender)
  gender: Gender;
  @IsString()
  @Length(2, 55)
  nationality: string;
}
