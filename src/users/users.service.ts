import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { SigninDto } from "src/auth/dto/Signin.dto";

@Injectable()
export class UsersService{
    findOneByEmail(email: string) {
        return this.usersRepository.findOneByEmail(email)
    }
    constructor(private usersRepository: UsersRepository){}

    getUsers(){
        return this.usersRepository.getUsers();
    }

    createUser(createUserDto: CreateUserDto){
        
        return this.usersRepository.saveUser(createUserDto)
    }
    
}