import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CapitalLetterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Convertir el nombre a minúsculas si está presente
    if (body.name) {
      body.name = body.name.toLowerCase();
    }

    console.log("Interceptor: nombre convertido a minúsculas");
    
    return next.handle();
  }
}

