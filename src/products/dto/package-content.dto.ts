import { IsNumber } from "class-validator";

export class PackageContentDto {
    /**
     * ID del producto que está incluido en el paquete
     * @example 1
     */
    @IsNumber()
    productId: number;

    /**
     * Cantidad del producto incluido en el paquete
     * @example 5
     */
    @IsNumber()
    quantity: number;
}
