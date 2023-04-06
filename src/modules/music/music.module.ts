import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import PrismaModule from 'prisma/prisma.module';
import MusicService from './music.service';
import MusicController from './music.controller';

@Module({
  imports: [MulterModule.register(), PrismaModule],
  providers: [MusicService],
  controllers: [MusicController],
})
export default class MusicModule {}
