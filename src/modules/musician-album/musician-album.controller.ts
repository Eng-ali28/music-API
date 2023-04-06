import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { CreateNewAlbumDto } from 'src/shared/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/shared/dto/update-album.dto';
import MusicianAlbumService from './msuician-album.service';
import { ParsePaginateInt } from 'src/shared/pipes/parsePaginateInt.pipe';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import { GetAll } from 'src/shared/types/GetAll.type';
import { MusicianAlbum } from '@prisma/client';
import { AlbumFilePipe } from 'src/utils/upload-pipes/image/album-image.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicianAlbumUrlInterceptor } from './interceptors/combin-url.interceptor';
import { AlbumMusicFilePipe } from 'src/utils/upload-pipes/image/music-album-image.pipe';

@Controller('musician-album')
@UseInterceptors(MusicianAlbumUrlInterceptor)
export default class MusicianAlbumController {
  constructor(private musicianAlbumService: MusicianAlbumService) {}
  @Get()
  async getAllMusicianAlbums(
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
    @Query('sort') sort?,
    @Query('search') search?: SearchType,
  ): Promise<GetAll<MusicianAlbum>> {
    return await this.musicianAlbumService.getAllMusicianAlbums(
      paginate,
      sort,
      search,
    );
  }
  @Get(':musicianId')
  async getSpecificmusicianAlbums(
    @Param('musicianId', ParseUUIDPipe) musicianId: string,
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
    @Query('sort') sort?,
    @Query('search') search?: SearchType,
  ): Promise<GetAll<MusicianAlbum>> {
    return await this.musicianAlbumService.getSpecificMusicianAlbums(
      musicianId,
      paginate,
      sort,
      search,
    );
  }
  // to get musics for specific album
  @Get(':albumId/specific-album')
  async getSpecificAlbum(
    @Param('albumId', ParseUUIDPipe) id: string,
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
  ) {
    return this.musicianAlbumService.getSpecificAlbum(id, paginate);
  }
  @Post(':musicianId/new-album')
  @UseInterceptors(FileInterceptor('image'))
  async createNewMusicianAlbum(
    @Param('musicianId', ParseUUIDPipe) id: string,
    @Body() data: CreateNewAlbumDto,
    @UploadedFile(AlbumFilePipe) image: string,
  ) {
    return await this.musicianAlbumService.createNewAlbum(id, data, image);
  }
  // push music to album
  @Put(':albumId/add-music/:musicId')
  async pushmusicToAlbum(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Param('musicId', ParseUUIDPipe) musicId: string,
  ) {
    return await this.musicianAlbumService.pushMusicToAlbum(albumId, musicId);
  }
  // pull music from album
  @Put(':albumId/pull-music/:musicId')
  async pullMusicFromAlbum(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Param('musicId', ParseUUIDPipe) musicId: string,
  ) {
    return await this.musicianAlbumService.pullMusicFromAlbum(albumId, musicId);
  }
  @Put(':id/update-album')
  @UseInterceptors(FileInterceptor('image'))
  async updateMusicianAlbumById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAlbumDto,
    @UploadedFile(AlbumMusicFilePipe) image?: string,
  ): Promise<MusicianAlbum> {
    return await this.musicianAlbumService.updateAlbum(id, data, image);
  }
  // clear musician from album
  @Delete(':id/delete-album')
  @HttpCode(204)
  async deleteMusicianAlbumById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.musicianAlbumService.deleteAlbum(id);
  }
  // clear all musician from the album
  @Delete(':id/clear-album')
  clearMusicianAlbumById(@Param('id', ParseUUIDPipe) id: string) {
    return { message: 'clear album', id };
  }
}
