import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ParsePaginateInt implements PipeTransform {
  transform(data: any) {
    if (!data) return;
    let take = +data.take;
    let page = +data.page;
    return { take, page };
  }
}
