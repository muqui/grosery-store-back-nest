import { IsArray, IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { CreateOrderDetailDto } from "src/order-details/dto/create-order-detail.dto";

export class CreateOrderDto {
    

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsArray()
    @IsNotEmpty({ each: true })
    orderDetails: CreateOrderDetailDto[];
}
