import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SingerAlbum } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { CreateNewAlbumDto } from 'src/shared/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/shared/dto/update-album.dto';
import { rmOldFile } from 'src/shared/methods/rm-old-file';
import { GetAll } from 'src/shared/types/GetAll.type';
import ApiFeature from 'src/utils/api feature/apifeature';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';

@Injectable()
export default class SingerAlbumService {
  public selectObj;
  constructor(private prisma: PrismaService) {
    this.selectObj = {
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        singer: { select: { name: true, type: true, image: true } },
        _count: { select: { song: true } },
      },
    };
  }
  // get all albums for all singers
  async getAllSingerAlbums(
    paginate?: PaginateType,
    sort = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<SingerAlbum>> {
    this.prisma.singerAlbum.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        singer: { select: { name: true, type: true, image: true } },
        _count: { select: { song: true } },
      },
    });
    const lists = await new ApiFeature(
      this.prisma,
      'singerAlbum',
      this.selectObj,
    )
      .search(search)
      .sort(sort)
      .paginate(paginate)
      .excute();

    return lists;
  }
  // get all albums for specific singer
  async getSpecificSingerAlbums(
    singerId: string,
    paginate?: PaginateType,
    sort = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<SingerAlbum>> {
    const lists = await new ApiFeature(
      this.prisma,
      'singerAlbum',
      this.selectObj,
      { singerId: singerId },
    )
      .search(search)
      .sort(sort)
      .paginate(paginate)
      .excute();

    return lists;
  }
  // get specific album for specific singer
  async getSpecificAlbum(
    albumId: string,
    { take = 5, page = 1 },
  ): Promise<GetAll<SingerAlbum>> {
    let skip = (page - 1) * take;
    const album = await this.prisma.singerAlbum.findUnique({
      where: { id: albumId },
      include: {
        singer: { select: { name: true, type: true, image: true } },
        song: {
          select: {
            name: true,
            description: true,
            source: true,
            tempImg: true,
            language: true,
            rate: true,
            publishedIn: true,
          },
          take,
          skip,
        },
      },
    });
    if (!album)
      throw new NotFoundException('album with id ' + albumId + ' not found');
    let paginateObject = { result: album.song.length, page };
    return { paginate: paginateObject, data: album };
  }
  // create new album for specific singer
  async createNewAlbum(
    singerId: string,
    { name }: CreateNewAlbumDto,
    image: string,
  ): Promise<SingerAlbum> {
    // check if album with name already exists
    const findAlbum = await this.prisma.singerAlbum.findUnique({
      where: { name },
    });
    // throw error if album with name already exists
    if (findAlbum)
      throw new BadRequestException('album with this name already exists.');
    //check if singer already exists
    const findSinger = await this.prisma.singer.findUnique({
      where: { id: singerId },
    });
    // throw error if not found.
    if (!findSinger)
      throw new BadRequestException('singer with this id not found.');
    // create new album
    const newAlbum = await this.prisma.singerAlbum.create({
      data: {
        name,
        image,
        singer: { connect: { id: singerId } },
      },
      include: { singer: { select: { name: true, type: true, image: true } } },
    });
    return newAlbum;
  }
  // update existing album for specific singer
  async updateAlbum(
    albumId: string,
    { name }: UpdateAlbumDto,
    image?: string,
  ): Promise<SingerAlbum> {
    // check if album already exists
    const album = await this.prisma.singerAlbum.findUnique({
      where: { id: albumId },
    });
    // throw error if album not found
    if (!album)
      throw new NotFoundException("album with id '" + albumId + "' not found");
    // update album
    let albumUpdated = await this.prisma.singerAlbum.update({
      where: { id: albumId },
      data: { name: name, image: image },
    });
    // check if album not updated throw error
    if (!albumUpdated) throw new BadRequestException(`Album not updated`);
    if (album.image && image)
      rmOldFile('./uploads/images/album-song/' + album.image);
    return albumUpdated;
  }
  async pushSongToAlbum(albumId: string, songId: string): Promise<SingerAlbum> {
    // check if album exists and contains song
    const checkAlbum = await this.prisma.singerAlbum.findFirst({
      where: { id: albumId, song: { some: { id: songId } } },
    });
    if (checkAlbum)
      throw new BadRequestException('album already include this song.');
    // connect song to album
    const updatedAlbum = await this.prisma.singerAlbum.update({
      where: { id: albumId },
      data: { song: { connect: { id: songId } } },
    });
    return updatedAlbum;
  }
  // delete song from album
  async pullSongFromAlbum(
    albumId: string,
    songId: string,
  ): Promise<SingerAlbum> {
    // check if album exists and contains song
    const checkAlbum = await this.prisma.singerAlbum.findFirst({
      where: { id: albumId, song: { some: { id: songId } } },
    });
    if (!checkAlbum) throw new NotFoundException('album not include this song');
    // disconnect song from album
    const updatedAlbum = await this.prisma.singerAlbum.update({
      where: { id: albumId },
      data: { song: { disconnect: { id: songId } } },
    });
    return updatedAlbum;
  }
  // delete existing album for specific singer
  async deleteAlbum(albumId: string): Promise<void> {
    // check if album already exists
    const album = await this.prisma.singerAlbum.findUnique({
      where: { id: albumId },
    });
    // throw error if album not found
    if (!album)
      throw new NotFoundException("album with id '" + albumId + "' not found");
    // delete album
    const albumDeleted = await this.prisma.singerAlbum.delete({
      where: { id: albumId },
    });
    console.log(albumDeleted);
    // check if album not deleted throw error
    if (!albumDeleted)
      throw new BadRequestException(
        'album with id ' + albumId + "' not exists",
      );
    // remove old image if exists
    if (albumDeleted.image)
      rmOldFile(`./uploads/images/album-song/${albumDeleted.image}`);
  }
}
