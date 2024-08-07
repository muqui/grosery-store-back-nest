import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { MinSizeValidatorPipe } from "src/pipes/minSizeValidator.pipe";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "./roles.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";


@ApiTags('Users')
@Controller("users")
export class UsersController{
 constructor(private readonly usersService: UsersService, private readonly cloudinaryService: CloudinaryService){
    
  
 }
 @Get()
 getUsers(){
     return this.usersService.getUsers();
 }
 @Post()
 createUser( @Body() createUserDto: CreateUserDto){
   
     return this.usersService.createUser(createUserDto)
 }

 @Get('admin')
 @Roles(Role.Admin)
 @UseGuards(AuthGuard,RolesGuard)
 getAdmin(){
    return "ruta protegida";
 }

 @Post('Profile/images')
 @UseInterceptors(FileInterceptor('image'))
 //@UsePipes(MinSizeValidatorPipe)
 getUserImages(@UploadedFile(
    new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({
                maxSize: 1000000    ,
                message: 'El archivo debe ser menor a 100kb'
            }),
            new FileTypeValidator({
                fileType: /(jpg|jpeg|png|webp)$/,
            })
        ]
    })
 ) file: Express.Multer.File){
    return this.cloudinaryService.upladImage(file);

 }
 @Put()
 updateUser(){
     return "este endpoint actualiza un usuario";
 }
 @Delete()
 deleteUser(){
     return "este endpoint borra un usuario";
 }
}