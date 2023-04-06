import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { parse } from 'path';
import { generateRandomNumber } from 'src/shared/methods/generate-random';
import { sharpPlace } from 'src/shared/methods/sharp';

export class AlbumMusicFilePipe implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return;
    let nameOnly = parse(image.originalname).name;
    let fullName = `${new Date().getTime()}-${generateRandomNumber(
      1000,
      999999,
    )}-${nameOnly}.webp`;

    await sharpPlace(image.buffer, 300, 300, 90, `album-music/${fullName}`);
    return fullName;
  }
}
