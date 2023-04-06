import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateSongDto } from '../dto/create-song.dto';

@Injectable()
export class ParseFloatRatePipe implements PipeTransform {
  transform(data: CreateSongDto) {
    if (!data.rate) return;
    data.rate = +data.rate;
    if (typeof data.rate !== 'number')
      throw new BadRequestException('rate must be a number');
    if (data.rate < 0 || data.rate > 5)
      throw new BadRequestException('rate must be between 0 and 5');
    return data;
  }
}
