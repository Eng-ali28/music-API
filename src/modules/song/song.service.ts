import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Song } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import ApiFeature from 'src/utils/api feature/apifeature';
import {
  PaginateType,
  SearchType,
  SortType,
} from 'src/utils/api feature/apifeature.type';
import { Result } from 'src/utils/upload-pipes/image/song-image.pipe';
import { CreateSongDto } from './dto/create-song.dto';
import { GetAll } from 'src/shared/types/GetAll.type';
import { UpdateSongDto } from './dto/update-song.dto';
import { rmOldFile } from 'src/shared/methods/rm-old-file';

@Injectable()
export default class SongService {
  selectObject: any;
  constructor(private prisma: PrismaService) {
    this.selectObject = {
      include: {
        artistAlbum: { select: { name: true, image: true } },
        tracks: {
          select: { title: true, index: true, link: true, songId: true },
        },
      },
    };
  }
  async getSongs(
    paginate: PaginateType = { page: 1, take: 10 },
    sort: any = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<Song>> {
    try {
      const songs = await new ApiFeature(this.prisma, 'song', this.selectObject)
        .search(search)
        .sort(sort)
        .paginate(paginate)
        .excute();
      return songs;
    } catch (error) {
      return error;
    }
  }
  async createNewSong(
    { name, artist, description, language, rate, type }: CreateSongDto,
    file: Result,
  ): Promise<Song> {
    let findSong = await this.prisma.song.findUnique({
      where: { name },
    });
    if (findSong) {
      throw new BadRequestException(
        'there is already existing song with name ' + name,
      );
    }
    let createSong = await this.prisma.song.create({
      data: {
        artist,
        description,
        language,
        name,
        rate,
        source: file.audio,
        tempImg: file.image,
        type,
      },
    });
    if (!createSong)
      throw new BadRequestException('Something went wrong, try again later');
    return createSong;
  }
  async getSongById(songId: string): Promise<Song> {
    let song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song)
      throw new NotFoundException('song with id ' + songId + ' not found');
    return song;
  }
  async updateSong(
    songId: string,
    { name, type, rate, artist, description, language }: UpdateSongDto,
    { image, audio }: Result,
  ): Promise<Song> {
    //check if song exists
    let song = await this.prisma.song.findUnique({ where: { id: songId } });
    //throw error if song not found
    if (!song)
      throw new NotFoundException('song with id ' + songId + ' not found');
    //update song
    let updatedSong = await this.prisma.song.update({
      where: { id: songId },
      data: {
        name,
        type,
        rate,
        artist,
        description,
        language,
        tempImg: image,
        source: audio,
      },
    });
    //check if song is not updated
    if (!updatedSong) {
      throw new BadRequestException('song not updated ');
    }
    if (audio && song.source) {
      rmOldFile('./uploads/audio/song/' + song.source);
    }
    if (image && song.tempImg) {
      rmOldFile('./uploads/images/song/' + song.tempImg);
    }
    return updatedSong;
  }
  async deleteSong(songId: string): Promise<void> {
    //check if song exists
    let song = await this.prisma.song.findUnique({ where: { id: songId } });
    //throw error if song not found
    if (!song)
      throw new NotFoundException('song with id ' + songId + ' not found');
    let deleteSong = await this.prisma.song.delete({ where: { id: songId } });
    if (!deleteSong) throw new BadRequestException('song is not deleted');
    if (song.source) {
      rmOldFile('./uploads/audio/song/' + song.source);
    }
    if (song.tempImg) {
      rmOldFile('./uploads/images/song/' + song.tempImg);
    }
  }
}
