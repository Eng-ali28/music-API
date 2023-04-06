import { Module } from '@nestjs/common';
import PrismaModule from 'prisma/prisma.module';
import PlaylistController from './playlist.controller';
import PlaylistService from './playlist.service';

@Module({
  imports: [PrismaModule],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export default class PlaylistModule {}
