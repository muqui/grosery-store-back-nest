import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
       /**
   * La contraseña debe ser dificil
   * @example 50.00
   */
       @IsNumber()
       amount: number;
   
       /**
      * La contraseña debe ser dificil
      * @example 'dinero no registrado'
      */
       @IsString()
       description: string;
   
       /**
        * @example 1
        */
       @IsNumber()
       expenseNamesId: number;
   
       /**
        * @example 2024-10-05
        */
       @IsDateString()
       date: Date;
}
