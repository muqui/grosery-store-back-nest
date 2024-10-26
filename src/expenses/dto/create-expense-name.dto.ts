import { IsString } from "class-validator";

export class CreateExpenseNameDto{

     /**
     * La contraseña debe ser dificil
     * @example Tecnologia
     */
    @IsString()
    name: string;
}