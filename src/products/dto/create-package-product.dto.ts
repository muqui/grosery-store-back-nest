import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePackageProductDto {
    @IsString()
    packageName: string; // Nombre del paquete

    @IsArray()
    @IsNumber({}, { each: true })
    packageContents: { 
        productId: number;
        quantity: number;
    }[];
}
