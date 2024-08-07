import { IsBoolean, IsEmail, IsEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    /**
     * debe es un correo valido y unico en la base de datos
     * @example muqui@hotmail.com
     */
    @IsString()
    @MinLength(1)
    @IsEmail() 
    email: string;

    /**
     * @example Albert
     */
    @IsString()
    @MinLength(4)
    name: string;

    /**
     * @example 123456
     */
    @IsString()
    @MinLength(5)
    password: string;

    /**
     * @example Hidalgo
     */
    @IsString()
    address: string;

    /**
     * @example 36775578
     */
    @IsString()
    phone: string;

    /**
     * @example Zapopan
     */
    @IsString()
    city: string;
    
    /**
     * @example Zapopan
     */
    @IsString()
    country: string;

    /**
     * @example true
     */
    @IsBoolean()
    @IsOptional()
    isAdmin: boolean;

}