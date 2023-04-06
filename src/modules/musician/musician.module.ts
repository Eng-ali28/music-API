import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import PrismaModule from 'prisma/prisma.module';
import MusicianController from './musician.controller';
import MusicianService from './musician.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    PrismaModule,
  ],
  controllers: [MusicianController],
  providers: [MusicianService],
})
export default class MusicianModule {}
