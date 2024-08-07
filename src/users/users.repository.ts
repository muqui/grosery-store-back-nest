import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { SigninDto } from "src/auth/dto/Signin.dto";

@Injectable()
export class UsersRepository{

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ){}

    private users = [
        {
            id: 1,
            email: 'title 1',
            name: 'description 1',
            password: '123456',
            address: 'calle',
            phone: '2344664309',
            country: 'Mexico',
            city: 'Guadalajara'
        },
        {
            id: 2,
            email: 'email@corona.net',
            name: 'description 2',
            password: '123456',
            address: 'calle',
            phone: '2344664309',
            country: 'Mexico',
            city: 'Guadalajara'
        },
        {
            id: 3,
            email: 'title 3',
            name: 'description 3',
            password: '123456',
            address: 'calle',
            phone: '2344664309',
            country: 'Mexico',
            city: 'Zapopan'
        }
       
    ]

    async getUsers(){
        return this.userRepository.find();
    }

    async saveUser(createUserDto: CreateUserDto){
        const userFound = await this.userRepository.findOne({  //buscamos si el usuario fue creado con aterioridar 
            where: {                                           // se busca por email
                email : createUserDto.email
            }
        })
        console.log(createUserDto)
        if(userFound){
            return new HttpException('User already exist', HttpStatus.CONFLICT)
        }
       return  this.userRepository.save(createUserDto);
    }
    
   /* findOneByEmail({email, password}: SigninDto){
        return this.userRepository.findOneBy({email})
      }*/
      findOneByEmail(email: string){
        return this.userRepository.findOneBy({email})
      }   
}