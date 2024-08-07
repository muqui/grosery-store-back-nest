import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, isBoolean, isNumber } from "class-validator";
import { PackageContentDto } from "./dto/package-content.dto";

export class CreateProductDto{

     /**
     * descripcion del producto
     * @example Lapiz MAE 2
     */
    @IsString()
    description:string; 

    /**
     * Precio del producto
     * @example 3.00
     */
    @IsNumber()
    price: number; 

    /**
     * Cantidad disponible
     * @example 5
     */
    @IsNumber()      
    stock: number; 

    /**
     * url de la imagen
     * @example https://res.cloudinary.com/dral3pvzq/image/upload/v1720243885/y5urcpvdwlftnlx0ocbm.png
     */
    @IsString()      
    imgUrl: string; 

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
    /**
     * codigo de barras unico
     * @example 754578754545
     */
    @IsString()
    barcode : string;

    /**
     * como se vende el producto unidad, paquete, granel
     * @example unidad
     */
    @IsString()
    howToSell : string;

    /**
     * precio de compra del producto
     * @example 2.50
     */
    @IsNumber()
    purchasePrice : number;


    /**
     * precio venta a mayoreo
     *@example 3.00
     */
    @IsNumber()
    wholesalePrice : number;

    /**
     * Activa el stock
     * @example true
     */
    @IsBoolean()
    stocktaking: boolean

    /**
     * stock minimo
     * @example 1
     */
    @IsNumber()
    minimumStock: number;

    @IsNumber()
    entriy: number;

   @IsNumber()
   output: number;

   @IsString()
   supplier: string

   @IsNumber()
   quantity: number;

     /**
     * Contenidos del paquete (opcional, solo si el producto se vende como paquete)
     */
     @IsOptional()
     @IsArray()
     @ValidateNested({ each: true })
     @Type(() => PackageContentDto)
     packageContents?: PackageContentDto[];
}