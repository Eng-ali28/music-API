import { Module } from '@nestjs/common';
import PrismaModule from 'prisma/prisma.module';
import MusicianAlbumService from './msuician-album.service';
import MusicianAlbumController from './musician-album.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [MulterModule.register(), PrismaModule],
  providers: [MusicianAlbumService],
  controllers: [MusicianAlbumController],
})
export default class MusicianAlbumModule {}
