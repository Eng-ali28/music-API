import { Injectable } from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';
import ApiFeature from 'src/utils/api feature/apifeature';
import {
  PaginateType,
  SearchType,
  SortType,
} from 'src/utils/api feature/apifeature.type';

@Injectable()
export default class PlaylistService {
  public selectObject;
  constructor(private prisma: PrismaService) {
    this.selectObject = {
      select: {
        id: true,
        name: true,
        user: {
          select: {
            id: true,
            username: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { tracks: true } },
        createdAt: true,
        updatedAt: true,
      },
    };
  }
  async getPlayLists(
    userId: string,
    paginate: PaginateType = { page: 1, take: 10 },
    sort: any = { createdAt: 'desc' },
    search?: SearchType,
  ) {
    try {
      const playlists = await new ApiFeature(
        this.prisma,
        'playList',
        this.selectObject,
        { userId: userId },
      )
        .search(search)
        .sort(sort)
        .paginate(paginate)
        .excute();
      return playlists;
    } catch (error) {
      return error;
    }
  }
}
