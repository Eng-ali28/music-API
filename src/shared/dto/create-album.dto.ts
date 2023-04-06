import { IsString, Length } from 'class-validator';

export class CreateNewAlbumDto {
  @IsString()
  @Length(3, 55)
  name: string;
}
