import { parse } from 'path';
import { Result } from 'src/utils/upload-pipes/image/song-image.pipe';
import { generateRandomNumber } from './generate-random';
import { sharpPlace } from './sharp';
import { BadRequestException } from '@nestjs/common';
import { writeFileSync } from 'fs';

export default async (
  image: Express.Multer.File[],
  audio: Express.Multer.File[],
  folderName: string,
) => {
  let result: Result = { image: '', audio: '' };
  // image file
  if (image && image[0].mimetype.startsWith('image')) {
    let nameOnly = parse(image[0].originalname).name;
    let fileName = `${new Date().getTime()}-${generateRandomNumber(
      1000,
      999999,
    )}${nameOnly}.webp`;
    await sharpPlace(
      image[0].buffer,
      300,
      300,
      90,
      `${folderName}/${fileName}`,
    );
    result.image = fileName;
  } else throw new BadRequestException('file must be image file');
  // audio file
  if (audio && audio[0].mimetype.startsWith('audio')) {
    let fileName = `${new Date().getTime()}-${generateRandomNumber(
      1000,
      999999,
    )}-${audio[0].originalname}`;
    writeFileSync(`./uploads/audio/${folderName}/${fileName}`, audio[0].buffer);
    result.audio = fileName;
  } else throw new BadRequestException('file must be audio file');
  return result;
};
