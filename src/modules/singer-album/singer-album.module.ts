import { Module } from '@nestjs/common';
import PrismaModule from 'prisma/prisma.module';
import SingerAlbumController from './singer-album.controller';
import SingerAlbumService from './singer-album.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule, MulterModule.register()],
  providers: [SingerAlbumService],
  controllers: [SingerAlbumController],
})
export default class SingerAlbumModule {}
