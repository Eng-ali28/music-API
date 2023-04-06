import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import PrismaModule from 'prisma/prisma.module';
import SingerController from './singer.controller';
import SingerService from './singer.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    PrismaModule,
  ],
  providers: [SingerService],
  controllers: [SingerController],
})
export default class SingerModule {}
