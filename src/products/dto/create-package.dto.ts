import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreatePackageDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsArray()
    @IsNumber({}, { each: true })
    products: number[]; // IDs de los productos que forman el paquete

    @IsArray()
    @IsObject({ each: true })
    packageContents: { productId: number; quantity: number }[]; // Contenido del paquete
}
