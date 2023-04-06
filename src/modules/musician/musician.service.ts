import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Musician } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { rmOldFile } from 'src/shared/methods/rm-old-file';
import { GetAll } from 'src/shared/types/GetAll.type';
import ApiFeature from 'src/utils/api feature/apifeature';
import {
  PaginateType,
  SearchType,
  SortType,
} from 'src/utils/api feature/apifeature.type';
import { CreateMusicianDto } from './dto/create.dto';
import { updateMusicianDto } from './dto/update-musican.dto';

@Injectable()
export default class MusicianService {
  public selectObject;
  constructor(private prisma: PrismaService) {
    this.selectObject = {};
  }
  async getMusicians(
    paginate: PaginateType = { page: 1, take: 10 },
    sort: any = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<Musician>> {
    try {
      const result = await new ApiFeature(
        this.prisma,
        'musician',
        this.selectObject,
      )
        .search(search)
        .sort(sort)
        .paginate(paginate)
        .excute();
      return { ...result };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getMusicianById(musicianId: string): Promise<Musician> {
    const findMusician = await this.prisma.musician.findUnique({
      where: { id: musicianId },
    });
    if (!findMusician) {
      throw new NotFoundException(
        'Musician with id ' + musicianId + ' not found',
      );
    }
    return findMusician;
  }
  async createMusician(
    { name, info, type, gender, nationality }: CreateMusicianDto,
    image?: string,
  ): Promise<Musician> {
    const musician = await this.prisma.musician.create({
      data: { name, info, type, gender, nationality, image },
    });
    if (!musician)
      throw new BadRequestException(
        `Could not create musician ${name}, try again later`,
      );
    return musician;
  }

  async updateMusician(
    musicianId: string,
    { name, info, type, gender, nationality }: updateMusicianDto,
    image?: string,
  ): Promise<Musician> {
    const findMusician = await this.getMusicianById(musicianId);
    const updateMusician = await this.prisma.musician.update({
      where: { id: musicianId },
      data: { name, info, type, nationality, image, gender },
    });
    if (findMusician.image)
      rmOldFile(`./uploads/images/musician/${findMusician.image}`);
    return updateMusician;
  }
  async deleteMusician(musicianId: string): Promise<void> {
    const deleteMusician = await this.prisma.musician.delete({
      where: { id: musicianId },
    });
    if (!deleteMusician)
      throw new NotFoundException(
        'Musician with id ' + musicianId + ' not found',
      );
    if (deleteMusician.image)
      rmOldFile(`./uploads/images/musician/${deleteMusician.image}`);
  }
}
