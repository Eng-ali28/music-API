import { BadRequestException } from '@nestjs/common';
import { unlink } from 'fs';
export const rmOldFile = (path: string) => {
  unlink(path, (err) => {
    if (err) throw new BadRequestException('file not removed.');
    console.log('file removed' + path);
  });
};
