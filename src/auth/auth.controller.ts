import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SigninDto } from "./dto/Signin.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";


@ApiTags('Auth')

@Controller("auth")
export class AuthsController{
    constructor(private readonly authService: AuthService){

    }
  
    @Post('signup')
    register(@Body() createUserDto: CreateUserDto){
        
        return this.authService.createUser(createUserDto)
    }
   
    @Post('signin')
    signin(@Body() signin: SigninDto){
        console.log(signin)
        return this.authService.signin(signin)
    }
}