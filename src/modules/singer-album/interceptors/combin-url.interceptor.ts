import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { albumFileUrl } from 'src/shared/methods/album-file-url.method';
import { setImageUrl } from 'src/shared/methods/setImageUrl';

export class SingerAlbumUrlInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((result) => {
        albumFileUrl(result, 'album-song');
        return result;
      }),
    );
  }
}
