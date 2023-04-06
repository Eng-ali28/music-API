import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { setFilesUrl } from 'src/shared/methods/setFilesUrl';

export class CombinUrlMusicInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((result) => {
        setFilesUrl(result, 'music');
        return result;
      }),
    );
  }
}
