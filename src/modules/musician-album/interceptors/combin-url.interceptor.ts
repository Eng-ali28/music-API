import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { albumMusicianFileUrl } from 'src/shared/methods/msucian-album-url.method';

export class MusicianAlbumUrlInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((result) => {
        albumMusicianFileUrl(result, 'album-music');
        return result;
      }),
    );
  }
}
