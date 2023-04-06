import { Artist, Gender } from '@prisma/client';
import { IsEnum, IsString, Length } from 'class-validator';

export class CreateMusicianDto {
  @IsString()
  @Length(2, 36)
  name: string;
  @IsString()
  @Length(30, 3000)
  info: string;
  @IsEnum(Artist)
  type: Artist;
  @IsEnum(Gender)
  gender: Gender;
  @IsString()
  @Length(3, 55)
  nationality: string;
}
