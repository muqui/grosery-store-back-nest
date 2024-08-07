import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()  //middleware funciona de forma local sobre una entidad
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
       console.log(`estas ejecutando un metodo ${req.method} en la ruta ${req.url}`);
       next();
    }
    
}

//middleware funciona de forma global
export function loggerGlobal(req: Request, res: Response, next: NextFunction){
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} -  ${now.toLocaleTimeString()}`;
   
    console.log(`estas ejecutando un metodo ${req.method} en la ruta ${req.url}  fecha y hora: ${formattedDate}`);
    next();   
}