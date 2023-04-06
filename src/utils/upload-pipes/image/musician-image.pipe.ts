import { BadRequestException, PipeTransform } from '@nestjs/common';
import { sharpPlace } from 'src/shared/methods/sharp';
import { parse } from 'path';
import { generateRandomNumber } from 'src/shared/methods/generate-random';
export class MusicianImagePipe implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return;
    if (image.mimetype.split('/')[0] != 'image')
      throw new BadRequestException('file must be image file');
    const nameOnly = parse(image.originalname).name;
    const fileName = `${generateRandomNumber(
      1000,
      999999,
    )}-${new Date().getTime()}-${nameOnly}.webp`;
    await sharpPlace(image.buffer, 300, 300, 90, `musician/${fileName}`);
    return fileName;
  }
}
