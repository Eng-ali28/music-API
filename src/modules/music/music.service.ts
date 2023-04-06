import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Music } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import ApiFeature from 'src/utils/api feature/apifeature';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import { CreateMusicDto } from './dto/create-music.dto';
import { GetAll } from 'src/shared/types/GetAll.type';
import { UpdateMusicDto } from './dto/update-music.dto';
import { rmOldFile } from 'src/shared/methods/rm-old-file';
import { Result } from 'src/utils/upload-pipes/image/song-image.pipe';

@Injectable()
export default class MusicService {
  selectObject: any;
  constructor(private prisma: PrismaService) {
    this.selectObject = {
      include: {
        musicAlbum: { select: { name: true, image: true } },
        tracks: {
          select: { title: true, index: true, link: true, musicId: true },
        },
      },
    };
  }
  async getMusics(
    paginate: PaginateType = { page: 1, take: 10 },
    sort: any = { publishedIn: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<Music>> {
    try {
      const musics = await new ApiFeature(
        this.prisma,
        'music',
        this.selectObject,
      )
        .search(search)
        .sort(sort)
        .paginate(paginate)
        .excute();
      return musics;
    } catch (error) {
      return error;
    }
  }
  async createNewMusic(
    { name, artist, description, city, type }: CreateMusicDto,
    file: Result,
  ): Promise<Music> {
    let findMusic = await this.prisma.music.findUnique({
      where: { name },
    });
    if (findMusic) {
      throw new BadRequestException(
        'there is already existing music with name ' + name,
      );
    }
    let createMusic = await this.prisma.music.create({
      data: {
        artist,
        description,
        city,
        name,
        source: file.audio,
        tempImg: file.image,
        type,
      },
    });
    if (!createMusic)
      throw new BadRequestException('Something went wrong, try again later');
    return createMusic;
  }
  async getMusicById(musicId: string): Promise<Music> {
    let music = await this.prisma.music.findUnique({ where: { id: musicId } });
    if (!music)
      throw new NotFoundException('music with id ' + musicId + ' not found');
    return music;
  }
  async updatemusic(
    musicId: string,
    { name, type, city, artist, description }: UpdateMusicDto,
    { image, audio }: Result,
  ): Promise<Music> {
    //check if music exists
    let music = await this.prisma.music.findUnique({ where: { id: musicId } });
    //throw error if music not found
    if (!music)
      throw new NotFoundException('music with id ' + musicId + ' not found');
    //update music
    let updatedMusic = await this.prisma.music.update({
      where: { id: musicId },
      data: {
        name,
        type,
        city,
        artist,
        description,
        tempImg: image,
        source: audio,
      },
    });
    //check if music is not updated
    if (!updatedMusic) {
      throw new BadRequestException('music not updated ');
    }
    if (audio && music.source) {
      rmOldFile('./uploads/audio/music/' + music.source);
    }
    if (image && music.tempImg) {
      rmOldFile('./uploads/images/music/' + music.tempImg);
    }
    return updatedMusic;
  }
  async deleteMusic(musicId: string): Promise<void> {
    //check if music exists
    let music = await this.prisma.music.findUnique({ where: { id: musicId } });
    //throw error if music not found
    if (!music)
      throw new NotFoundException('music with id ' + musicId + ' not found');
    let deleteMusic = await this.prisma.music.delete({
      where: { id: musicId },
    });
    if (!deleteMusic) throw new BadRequestException('music is not deleted');
    if (music.source) {
      rmOldFile('./uploads/audio/music/' + music.source);
    }
    if (music.tempImg) {
      rmOldFile('./uploads/images/music/' + music.tempImg);
    }
  }
}
