import { PartialType } from '@nestjs/mapped-types';
import { CreateNewAlbumDto } from './create-album.dto';

export class UpdateAlbumDto extends PartialType(CreateNewAlbumDto) {}
