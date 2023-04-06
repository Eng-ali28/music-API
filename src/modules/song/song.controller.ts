import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Song } from '@prisma/client';
import { memoryStorage } from 'multer';
import { ParsePaginateInt } from 'src/shared/pipes/parsePaginateInt.pipe';
import { GetAll } from 'src/shared/types/GetAll.type';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import {
  Result,
  MixFilePipe,
} from 'src/utils/upload-pipes/image/song-image.pipe';
import { CreateSongDto } from './dto/create-song.dto';
import { ParseFloatRatePipe } from './pipes/ParseRateInt.pipe';
import SongService from './song.service';
import { SongCombinUrlInterceptor } from './interceptors/combin-url.interceptor';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
@UseInterceptors(SongCombinUrlInterceptor)
export default class SongController {
  constructor(private songService: SongService) {}
  // with query params for filteration and pagination.
  @Get()
  async getAllSongs(
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
    @Query('sort') sort: any = { publishedIn: 'asc' },
    @Query('search') search?: SearchType,
  ): Promise<GetAll<Song>> {
    return this.songService.getSongs(paginate, sort, search);
  }
  @Post(':singerId/new-song')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async createNewSong(
    @Body(ParseFloatRatePipe) data: CreateSongDto,
    @UploadedFiles(MixFilePipe) file: Result,
  ) {
    return await this.songService.createNewSong(data, file);
  }

  @Get(':id')
  async getSongById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.songService.getSongById(id);
  }
  // add song to play-list
  @Post(':songId/add-playlist/:playlistId')
  addSongToPlaylist(
    @Param('songId', ParseUUIDPipe) songId: string,
    @Param('playlistId', ParseUUIDPipe) playlistId: string,
  ) {
    return { songId, playlistId };
  }
  // add song to favorite-list
  @Post(':songId/add-playlist/:favoriteId')
  addSongToFavorite(
    @Param('songId', ParseUUIDPipe) songId: string,
    @Param('favoriteId', ParseUUIDPipe) favoriteId: string,
  ) {
    return { songId, favoriteId };
  }
  // update song name and src
  @Put(':id/update-song')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      { storage: memoryStorage() },
    ),
  )
  async updateSong(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ParseFloatRatePipe) data: UpdateSongDto,
    @UploadedFiles(MixFilePipe) file: Result,
  ) {
    return await this.songService.updateSong(id, data, file);
  }
  //delete song
  @Delete(':id/delete-song')
  @HttpCode(204)
  async deleteSong(@Param('id', ParseUUIDPipe) id: string) {
    return await this.songService.deleteSong(id);
  }
}
