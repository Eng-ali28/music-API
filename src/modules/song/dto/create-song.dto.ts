import { Artist, LanguageType, SongType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  min,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @Length(3, 55)
  name: string;
  @IsString()
  @Length(20, 3000)
  description: string;
  @IsEnum(Artist)
  artist: Artist;
  @IsEnum(SongType)
  type: SongType;
  @IsEnum(LanguageType)
  language: LanguageType;

  rate: number;
}
