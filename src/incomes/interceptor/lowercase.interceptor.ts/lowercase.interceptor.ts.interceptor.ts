import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CapitalizeFirstLetterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    if (body.name) {
      // Transformamos el nombre: primera letra de cada palabra en mayúsculas
      body.name = body.name
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    return next.handle().pipe(
      map((data) => {
        // Si deseas modificar la respuesta también, puedes hacerlo aquí
        return data;
      })
    );
  }
}
