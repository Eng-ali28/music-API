import { Artist, MusicType } from '@prisma/client';
import { IsString, Length, IsEnum } from 'class-validator';

export class CreateMusicDto {
  @IsString()
  @Length(3, 55)
  name: string;
  @IsString()
  @Length(20, 2000)
  description: string;
  @IsEnum(Artist)
  artist: Artist;
  @IsEnum(MusicType)
  type: MusicType;
  @IsString()
  @Length(3, 55)
  city: string;
}
