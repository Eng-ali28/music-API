import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  SearchType,
  PaginateType,
  SortType,
} from 'src/utils/api feature/apifeature.type';
import { CreateNewAlbumDto } from 'src/shared/dto/create-album.dto';
import { ParsePaginateInt } from 'src/shared/pipes/parsePaginateInt.pipe';
import { SingerImagePipe } from 'src/utils/upload-pipes/image/singer-image.pipe';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update.dto';
import SingerService from './singer.service';
import { CombinUrlSingerInterceptor } from 'src/modules/singer/interceptor/combin-url.interceptor';

@Controller('singers')
@UseInterceptors(CombinUrlSingerInterceptor)
export default class SingerController {
  constructor(private singerService: SingerService) {}
  //base-url/api/v1/singers
  @Get()
  async getAllsingers(
    @Query('search') search: SearchType,
    @Query('paginate', ParsePaginateInt) paginate: PaginateType,
    @Query('sort') sort: SortType,
  ) {
    return await this.singerService.getAllSingers(paginate, sort, search);
  }
  // base-url/api/v1/singers/new-singer
  @Post('new-singer')
  @UseInterceptors(FileInterceptor('image'))
  async createNewSinger(
    @Body() data: CreateSingerDto,
    @UploadedFile(SingerImagePipe) image: string,
  ) {
    const { name, info, type, gender, nationality } = data;
    return await this.singerService.createNewSinger(
      name,
      info,
      gender,
      nationality,
      type,
      image,
    );
  }
  // base-url/api/v1/singers/:id
  @Get(':id')
  async getSingersById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.singerService.getSingerById(id);
  }
  // base-url/api/v1/singers/:id/add-album
  @Post(':id/add-album')
  createNewAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: CreateNewAlbumDto,
  ) {
    return { message: 'new album', data };
  }
  // base-url/api/v1/singers/:id/update-singer
  @Put(':id/update-singer')
  @UseInterceptors(FileInterceptor('image'))
  updateSinger(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateSingerDto,
    @UploadedFile(SingerImagePipe) image?: string,
  ) {
    return this.singerService.updateSinger(id, data, image);
  }
  // base-url/api/v1/singers/:id/delete-singer
  @Delete(':id/delete-singer')
  @HttpCode(204)
  async deleteSinger(@Param('id', ParseUUIDPipe) id: string) {
    return await this.singerService.deleteSinger(id);
  }
}
