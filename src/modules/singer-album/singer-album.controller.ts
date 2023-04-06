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
import SingerAlbumService from './singer-album.service';
import { ParsePaginateInt } from 'src/shared/pipes/parsePaginateInt.pipe';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import { GetAll } from 'src/shared/types/GetAll.type';
import { SingerAlbum } from '@prisma/client';
import { AlbumFilePipe } from 'src/utils/upload-pipes/image/album-image.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { SingerAlbumUrlInterceptor } from './interceptors/combin-url.interceptor';

@Controller('singer-album')
@UseInterceptors(SingerAlbumUrlInterceptor)
export default class SingerAlbumController {
  constructor(private singerAlbumService: SingerAlbumService) {}
  @Get()
  async getAllSingerAlbums(
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
    @Query('sort') sort?,
    @Query('search') search?: SearchType,
  ): Promise<GetAll<SingerAlbum>> {
    return await this.singerAlbumService.getAllSingerAlbums(
      paginate,
      sort,
      search,
    );
  }
  @Get(':singerId')
  async getSpecificSingerAlbums(
    @Param('singerId', ParseUUIDPipe) singerId: string,
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
    @Query('sort') sort?,
    @Query('search') search?: SearchType,
  ): Promise<GetAll<SingerAlbum>> {
    return await this.singerAlbumService.getSpecificSingerAlbums(
      singerId,
      paginate,
      sort,
      search,
    );
  }
  // to get songs for specific album
  @Get(':albumId/specific-album')
  async getSpecificAlbum(
    @Param('albumId', ParseUUIDPipe) id: string,
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
  ) {
    return this.singerAlbumService.getSpecificAlbum(id, paginate);
  }
  @Post(':singerId/new-album')
  @UseInterceptors(FileInterceptor('image'))
  async createNewSingerAlbum(
    @Param('singerId', ParseUUIDPipe) id: string,
    @Body() data: CreateNewAlbumDto,
    @UploadedFile(AlbumFilePipe) image: string,
  ) {
    return await this.singerAlbumService.createNewAlbum(id, data, image);
  }
  // push song to album
  @Put(':albumId/add-song/:songId')
  async pushSongToAlbum(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Param('songId', ParseUUIDPipe) songId: string,
  ) {
    return await this.singerAlbumService.pushSongToAlbum(albumId, songId);
  }
  // pull song from album
  @Put(':albumId/pull-song/:songId')
  async pullSongFromAlbum(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Param('songId', ParseUUIDPipe) songId: string,
  ) {
    return await this.singerAlbumService.pullSongFromAlbum(albumId, songId);
  }
  @Put(':id/update-album')
  @UseInterceptors(FileInterceptor('image'))
  async updateSingerAlbumById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAlbumDto,
    @UploadedFile(AlbumFilePipe) image?: string,
  ): Promise<SingerAlbum> {
    return await this.singerAlbumService.updateAlbum(id, data, image);
  }
  // clear Singer from album
  @Delete(':id/delete-album')
  @HttpCode(204)
  async deleteSingerAlbumById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.singerAlbumService.deleteAlbum(id);
  }
  // clear all Singer from the album
  @Delete(':id/clear-album')
  clearSingerAlbumById(@Param('id', ParseUUIDPipe) id: string) {
    return { message: 'clear album', id };
  }
}
