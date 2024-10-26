import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { SigninDto } from "./dto/Signin.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from "src/users/roles.enum";

@Injectable()
export class AuthService{
    
    constructor(
        private readonly userService : UsersService,
        private readonly jwtService: JwtService
    ){}
    getAuth(){
        return "Get all auths";
    }
    async signin({email, password}: SigninDto){
        const user = await this.userService.findOneByEmail(email)

        

        if(!user){
            throw new UnauthorizedException('email or password incorrect')
        }

        const isPasswordValided = await bcrypt.compare(password, user.password)

        if(!isPasswordValided){
            throw new UnauthorizedException('email or password  is wrong')
        }
       
        const payLoad = {email: user.email,
                      
                       roles: [user.isAdmin? Role.Admin : Role.User]
        }
    
        const token = await this.jwtService.signAsync(payLoad);
        return {token, email, id: user.id};
        

    }

    async createUser(createUserDto: CreateUserDto) {
       
       // createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
      
        return this.userService.createUser(createUserDto);
    }
}