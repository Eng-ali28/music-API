import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { Result } from './song-image.pipe';
import mixFilesMethod from 'src/shared/methods/mix-files.method';

export class MixFileMusicPipe implements PipeTransform {
  async transform(file: {
    image: Express.Multer.File[];
    audio: Express.Multer.File[];
  }): Promise<Result> {
    return await mixFilesMethod(file.image, file.audio, 'music');
  }
}
