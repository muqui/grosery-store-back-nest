import { IsArray, IsNumber } from "class-validator";

export class CreateOrderDetailDto {
    @IsNumber()
    price: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    purchasePrice: number; // precio de compra.
  
    @IsNumber()
    productId: number; // Cambiar a un solo productId en lugar de una lista de productos


    
}
