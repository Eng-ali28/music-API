import { BadRequestException } from '@nestjs/common';
import { PaginateType, SearchType, SortType } from './apifeature.type';
export default class ApiFeature {
  public query;
  public paginateObject;
  constructor(
    public prisma: any,
    public model: string,
    public selectObject: any,
    public whereObject?: any,
  ) {
    this.prisma = prisma;
    this.model = model;
    this.selectObject = { ...selectObject } || {};
    this.whereObject = whereObject || {};
    this.query = {};
    this.paginateObject = {};
  }
  search(data?: SearchType) {
    if (!data) {
      this.query = {
        ...this.selectObject,
        ...this.query,
        where: { ...this.whereObject },
      };
      return this;
    }
    let { field, value } = data;
    this.query = {
      ...this.query,
      where: {
        [field]: { contains: value, mode: 'insensitive' },
        ...this.whereObject,
      },
    };
    return this;
  }
  sort(data: any) {
    this.query = {
      ...this.query,
      orderBy: { ...data },
    };
    return this;
  }
  paginate(data: PaginateType = { page: 1, take: 10 }) {
    let { page, take } = data;
    let skip = (+page - 1) * +take;
    this.query = { ...this.query, take, skip };
    this.paginateObject = { ...this.paginateObject, page };
    return this;
  }
  async excute() {
    let data = await this.prisma[this.model].findMany(this.query);
    if (data.length == 0) throw new BadRequestException('no data found');
    this.paginateObject = { ...this.paginateObject, result: data.length };

    return { paginate: this.paginateObject, data };
  }
}
