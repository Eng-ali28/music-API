import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseUUIDPipe,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { ParsePaginateInt } from 'src/shared/pipes/parsePaginateInt.pipe';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import MusicService from './music.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateMusicDto } from './dto/create-music.dto';
import { Result } from 'src/utils/upload-pipes/image/song-image.pipe';
import { MixFileMusicPipe } from 'src/utils/upload-pipes/image/music-files.pipe';
import { UpdateMusicDto } from './dto/update-music.dto';
import { CombinUrlMusicInterceptor } from './interceptors/combin-url.interceptor';
@Controller('musics')
@UseInterceptors(CombinUrlMusicInterceptor)
export default class MusicController {
  constructor(private musicSerivce: MusicService) {}
  // with query params for filteration and pagination.
  @Get()
  async getAllMusics(
    @Query('paginate', ParsePaginateInt) paginate: PaginateType,
    @Query('sort') sort = { publishedIn: 'desc' },
    @Query('search') search: SearchType,
  ) {
    return await this.musicSerivce.getMusics(paginate, sort, search);
  }
  @Post('new-music')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async createNewMusic(
    @Body() data: CreateMusicDto,
    @UploadedFiles(MixFileMusicPipe) file: Result,
  ) {
    return await this.musicSerivce.createNewMusic(data, file);
  }
  @Get(':id')
  async getMusicById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.musicSerivce.getMusicById(id);
  }
  // add Music to play-list
  @Post(':musicId/add-playlist/:playlistId')
  addMusicToPlaylist(
    @Param('MusicId', ParseUUIDPipe) musicId: string,
    @Param('playlistId', ParseUUIDPipe) playlistId: string,
  ) {
    return { musicId, playlistId };
  }
  // add Music to favorite-list
  @Post(':musicId/add-playlist/:playlistId')
  addMusicToFavorite(
    @Param('MusicId', ParseUUIDPipe) musicId: string,
    @Param('favoriteId', ParseUUIDPipe) favoriteId: string,
  ) {
    return { musicId, favoriteId };
  }
  // update Music name and src
  @Put(':id/update-music')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async updateMusic(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data?: UpdateMusicDto,
    @UploadedFiles(MixFileMusicPipe) file?: Result,
  ) {
    return await this.musicSerivce.updatemusic(id, data, file);
  }
  //delete Music
  @Delete(':id/delete-Music')
  @HttpCode(204)
  async deleteMusic(@Param('id', ParseUUIDPipe) id: string) {
    return await this.musicSerivce.deleteMusic(id);
  }
}
