import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import MusicianService from './musician.service';
import { CreateMusicianDto } from './dto/create.dto';
import { updateMusicianDto } from './dto/update-musican.dto';
import { CombinUrlMusicianInterceptor } from './interceptor/combin-url.interceptor';
import { ParsePaginateInt } from 'src/shared/pipes/parsePaginateInt.pipe';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import { GetAll } from 'src/shared/types/GetAll.type';
import { Musician } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicianImagePipe } from 'src/utils/upload-pipes/image/musician-image.pipe';
@Controller('musicians')
@UseInterceptors(CombinUrlMusicianInterceptor)
export default class MusicianController {
  constructor(private musicianService: MusicianService) {}
  //base-url/api/v1/musicians
  @Get()
  async getAllMusicians(
    @Query('paginate', ParsePaginateInt) paginate?: PaginateType,
    @Query('sort') sort?,
    @Query('search') search?: SearchType,
  ): Promise<GetAll<Musician>> {
    return await this.musicianService.getMusicians(paginate, sort, search);
  }
  //base-url/api/v1/musicians/new-musician
  @Post('new-musician')
  @UseInterceptors(FileInterceptor('image'))
  async createMusician(
    @Body() data: CreateMusicianDto,
    @UploadedFile(MusicianImagePipe) image?: string,
  ) {
    return await this.musicianService.createMusician(data, image);
  }
  //base-url/api/v1/musicians/:id
  @Get(':id')
  async getMusicianById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.musicianService.getMusicianById(id);
  }
  @Post(':id/new-album')
  createMusicanAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('createMusicanAlbumDto') { name },
  ) {
    return `musican for album with name ${name}`;
  }
  @Put(':id/update-musician')
  @UseInterceptors(FileInterceptor('image'))
  updateMusician(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('updateMusican') data: updateMusicianDto,
    @UploadedFile(MusicianImagePipe) image?: string,
  ): Promise<Musician> {
    return this.musicianService.updateMusician(id, data, image);
  }
  @Delete(':id/delete-musician')
  @HttpCode(204)
  async deleteMusician(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.musicianService.deleteMusician(id);
  }
}
