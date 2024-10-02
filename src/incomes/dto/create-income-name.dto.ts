import { IsString } from "class-validator";

export class CreateIncomeNameDto{

     /**
     * La contraseña debe ser dificil
     * @example Tecnologia
     */
    @IsString()
    name: string;
}