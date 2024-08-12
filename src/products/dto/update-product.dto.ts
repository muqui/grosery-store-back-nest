import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class PackageContentDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    imgUrl?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @IsString()
    @IsOptional()
    barcode?: string;

    @IsString()
    @IsOptional()
    howToSell?: string;

    @IsNumber()
    @IsOptional()
    purchasePrice?: number;

    @IsNumber()
    @IsOptional()
    wholesalePrice?: number;

    @IsBoolean()
    @IsOptional()
    stocktaking?: boolean;

    @IsNumber()
    @IsOptional()
    minimumStock?: number;

    @IsNumber()
    @IsOptional()
    entriy?: number;

    @IsNumber()
    @IsOptional()
    output?: number;

    @IsString()
    @IsOptional()
    supplier?: string;

    @IsNumber()
    @IsOptional()
    quantity?: number;

    @IsArray()
    @Type(() => PackageContentDto)
    @IsOptional()
    packageContents?: PackageContentDto[];
}
