import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import PrismaModule from 'prisma/prisma.module';
import SongController from './song.controller';
import SongService from './song.service';

@Module({
  imports: [MulterModule.register(), PrismaModule],
  providers: [SongService],
  controllers: [SongController],
})
export default class SongModule {}
