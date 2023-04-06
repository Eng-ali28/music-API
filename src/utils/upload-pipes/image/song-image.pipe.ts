import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import mixFilesMethod from 'src/shared/methods/mix-files.method';
export type Result = { image: string; audio: string };
export class MixFilePipe implements PipeTransform {
  async transform({
    image,
    audio,
  }: {
    image: Express.Multer.File[];
    audio: Express.Multer.File[];
  }): Promise<Result> {
    return await mixFilesMethod(image, audio, 'song');
  }
}
