import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { parse } from 'path';
import { generateRandomNumber } from 'src/shared/methods/generate-random';
import { sharpPlace } from 'src/shared/methods/sharp';
export class SingerImagePipe implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return;
    if (image.mimetype.split('/')[0] !== 'image')
      throw new BadRequestException('file must be an image');
    let nameOnly = parse(image.originalname).name;
    let fileName = `${new Date().getTime()}-${generateRandomNumber(
      1000,
      999999,
    )}${nameOnly}.webp`;
    await sharpPlace(image.buffer, 300, 300, 90, `singer/${fileName}`);
    return fileName;
  }
}
