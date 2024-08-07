import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateProductDto {
     /**
     * Descripcion del producto
     * @example lapiz color rojo No 2
     */
     @IsString()
     description?:string; 
 
     /**
      * Precio del producto
      * @example 3.00
      */
     @IsNumber()
     price?: number; 
 
     /**
      * Cantidad disponible
      * @example 5
      */
     @IsNumber()      
     stock?: number; 
 
     /**
      * url de la imagen
      * @example https://res.cloudinary.com/dral3pvzq/image/upload/v1720243885/y5urcpvdwlftnlx0ocbm.png
      */
     @IsString()      
     imgUrl?: string; 
 
     /**
      * Nombre del producto
      * @example Lapiz MAE
      */
     @IsString()     
     name : string;   
 
     /**
      * Id de la categoria clave foranea
      * @example 1
      */
     @IsNumber()    
     categoryId: number;  


 
}