import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { SigninDto } from "src/auth/dto/Signin.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository{

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ){}



    async getUsers(){
        return this.userRepository.find();
    }

    async saveUser(createUserDto: CreateUserDto){
        const userFound = await this.findOneByNameOrEmail(createUserDto)
       
        if(userFound){
            //return new HttpException('User or email already exist', HttpStatus.CONFLICT)
            throw new HttpException(
                'User or email already exists',
                HttpStatus.CONFLICT
              );
        }
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
         this.userRepository.save(createUserDto);
         return "user created"
    }
    
    async findOneByNameOrEmail({ name, email }: CreateUserDto) {
        return await this.userRepository.findOne({
            where: [
                { name }, // Buscar por nombre de usuario
                { email } // Buscar por correo electrónico
            ],
        });
    }
      findOneByEmail(email: string){
        return this.userRepository.findOneBy({email})
      }   
      findOneByUser(name: string){
        return this.userRepository.findOneBy({name})
      }   
}