import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicianDto } from './create.dto';

export class updateMusicianDto extends PartialType(CreateMusicianDto) {}
