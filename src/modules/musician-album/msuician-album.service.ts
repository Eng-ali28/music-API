import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MusicianAlbum } from '@prisma/client';
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
export default class MusicianAlbumService {
  public selectObj;
  constructor(private prisma: PrismaService) {
    this.selectObj = {
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        musician: { select: { name: true, type: true, image: true } },
        _count: { select: { music: true } },
      },
    };
  }
  // get all albums for all singers
  async getAllMusicianAlbums(
    paginate?: PaginateType,
    sort = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<MusicianAlbum>> {
    this.prisma.musicianAlbum.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        musician: { select: { name: true, type: true, image: true } },
        _count: { select: { music: true } },
      },
    });
    const lists = await new ApiFeature(
      this.prisma,
      'musicianAlbum',
      this.selectObj,
    )
      .search(search)
      .sort(sort)
      .paginate(paginate)
      .excute();

    return lists;
  }
  // get all albums for specific singer
  async getSpecificMusicianAlbums(
    musicianId: string,
    paginate?: PaginateType,
    sort = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<MusicianAlbum>> {
    const lists = await new ApiFeature(
      this.prisma,
      'musicianAlbum',
      this.selectObj,
      { musicianId: musicianId },
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
  ): Promise<GetAll<MusicianAlbum>> {
    let skip = (page - 1) * take;
    const album = await this.prisma.musicianAlbum.findUnique({
      where: { id: albumId },
      include: {
        musician: { select: { name: true, type: true, image: true } },
        music: {
          select: {
            name: true,
            description: true,
            source: true,
            tempImg: true,
            city: true,
            publishedIn: true,
          },
          take,
          skip,
        },
      },
    });
    if (!album)
      throw new NotFoundException('album with id ' + albumId + ' not found');
    let paginateObject = { result: album.music.length, page };
    return { paginate: paginateObject, data: album };
  }
  // create new album for specific singer
  async createNewAlbum(
    musicianId: string,
    { name }: CreateNewAlbumDto,
    image: string,
  ): Promise<MusicianAlbum> {
    // check if album with name already exists
    const findAlbum = await this.prisma.musicianAlbum.findUnique({
      where: { name },
    });
    // throw error if album with name already exists
    if (findAlbum)
      throw new BadRequestException('album with this name already exists.');
    //check if singer already exists
    const findMusician = await this.prisma.musician.findUnique({
      where: { id: musicianId },
    });
    // throw error if not found.
    if (!findMusician)
      throw new BadRequestException('singer with this id not found.');
    // create new album
    const newAlbum = await this.prisma.musicianAlbum.create({
      data: {
        name,
        image,
        musician: { connect: { id: musicianId } },
      },
      include: {
        musician: { select: { name: true, type: true, image: true } },
      },
    });
    return newAlbum;
  }
  // update existing album for specific singer
  async updateAlbum(
    albumId: string,
    { name }: UpdateAlbumDto,
    image?: string,
  ): Promise<MusicianAlbum> {
    // check if album already exists
    const album = await this.prisma.musicianAlbum.findUnique({
      where: { id: albumId },
    });
    // throw error if album not found
    if (!album)
      throw new NotFoundException("album with id '" + albumId + "' not found");
    // update album
    let albumUpdated = await this.prisma.musicianAlbum.update({
      where: { id: albumId },
      data: { name: name, image: image },
    });
    // check if album not updated throw error
    if (!albumUpdated) throw new BadRequestException(`Album not updated`);
    if (album.image && image)
      rmOldFile('./uploads/images/album-music/' + album.image);
    return albumUpdated;
  }
  async pushMusicToAlbum(
    albumId: string,
    musicId: string,
  ): Promise<MusicianAlbum> {
    // check if album exists and contains song
    const checkAlbum = await this.prisma.musicianAlbum.findFirst({
      where: { id: albumId, music: { some: { id: musicId } } },
    });
    if (checkAlbum)
      throw new BadRequestException('album already include this song.');
    // connect song to album
    const updatedAlbum = await this.prisma.musicianAlbum.update({
      where: { id: albumId },
      data: { music: { connect: { id: musicId } } },
    });
    return updatedAlbum;
  }
  // delete song from album
  async pullMusicFromAlbum(
    albumId: string,
    musicId: string,
  ): Promise<MusicianAlbum> {
    // check if album exists and contains song
    const checkAlbum = await this.prisma.musicianAlbum.findFirst({
      where: { id: albumId, music: { some: { id: musicId } } },
    });
    if (!checkAlbum) throw new NotFoundException('album not include this song');
    // disconnect song from album
    const updatedAlbum = await this.prisma.musicianAlbum.update({
      where: { id: albumId },
      data: { music: { disconnect: { id: musicId } } },
    });
    return updatedAlbum;
  }
  // delete existing album for specific singer
  async deleteAlbum(albumId: string): Promise<void> {
    // check if album already exists
    const album = await this.prisma.musicianAlbum.findUnique({
      where: { id: albumId },
    });
    // throw error if album not found
    if (!album)
      throw new NotFoundException("album with id '" + albumId + "' not found");
    // delete album
    const albumDeleted = await this.prisma.musicianAlbum.delete({
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
      rmOldFile(`./uploads/images/album-music/${albumDeleted.image}`);
  }
}
