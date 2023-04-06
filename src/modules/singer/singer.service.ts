import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist, Gender, Singer } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { GetAll } from 'src/shared/types/GetAll.type';
import ApiFeature from 'src/utils/api feature/apifeature';
import { rmOldFile } from '../../shared/methods/rm-old-file';
import {
  PaginateType,
  SearchType,
} from 'src/utils/api feature/apifeature.type';
import { UpdateSingerDto } from './dto/update.dto';

@Injectable()
export default class SingerService {
  selectObject: any;
  constructor(private prisma: PrismaService) {
    this.selectObject = { include: { album: true } };
  }
  async getAllSingers(
    paginate: PaginateType = { page: 1, take: 10 },
    sort: any = { createdAt: 'desc' },
    search?: SearchType,
  ): Promise<GetAll<Singer>> {
    const result = await new ApiFeature(
      this.prisma,
      'singer',
      this.selectObject,
    )
      .search(search)
      .sort(sort)
      .paginate(paginate)
      .excute();
    return result;
  }
  async getSingerById(singerId: string): Promise<Singer> {
    const singer = await this.prisma.singer.findUnique({
      where: { id: singerId },
      include: { album: true },
    });
    if (!singer) {
      throw new NotFoundException(`Singer with this id ${singerId} not found`);
    }
    return singer;
  }
  async createNewSinger(
    name: string,
    info: string,
    gender: Gender,
    nationality: string,
    type: Artist,
    image?: string,
  ): Promise<Singer> {
    const newSinger = await this.prisma.singer.create({
      data: {
        name: name,
        gender: gender,
        info: info,
        nationality: nationality,
        type: type,
        image: image,
      },
    });
    if (!newSinger) {
      throw new BadRequestException(`create new singer failed,Try again later`);
    }
    return newSinger;
  }
  //create new singer-album
  async updateSinger(
    singerId: string,
    { name, gender, info, nationality, type }: UpdateSingerDto,
    image: string,
  ): Promise<Singer> {
    let findSinger = await this.catchSinger(singerId);
    const updatedSinger = await this.prisma.singer.update({
      where: { id: singerId },
      data: { name, gender, type, nationality, info, image },
    });
    console.log(findSinger);
    if (findSinger.image)
      rmOldFile(`./uploads/images/singer/${findSinger.image}`);
    return updatedSinger;
  }
  async deleteSinger(singerId: string): Promise<void> {
    let findSinger = await this.catchSinger(singerId);
    let deletedSinger = await this.prisma.singer.delete({
      where: { id: singerId },
    });
    if (!deletedSinger)
      throw new NotFoundException(`Singer with id ${singerId} not found`);
    if (findSinger.image)
      rmOldFile(`./uploads/images/singer/${findSinger.image}`);
  }

  async catchSinger(singerId: string) {
    const findSinger = await this.prisma.singer.findUnique({
      where: { id: singerId },
    });
    if (!findSinger) {
      throw new NotFoundException(`Singer with this id ${singerId} not found`);
    }
    return findSinger;
  }
}
