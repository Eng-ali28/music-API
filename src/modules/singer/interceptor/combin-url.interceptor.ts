import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import appConfig from 'src/config/app.config';
import { setImageUrl } from 'src/shared/methods/setImageUrl';

export class CombinUrlSingerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((res) => {
        setImageUrl(res, 'singer');

        return res;
      }),
    );
  }
}
