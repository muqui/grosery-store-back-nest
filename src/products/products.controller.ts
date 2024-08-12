import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiExcludeController, ApiExcludeEndpoint, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/auth.guard";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/users/roles.enum";
import { RolesGuard } from "src/guards/roles.guard";


@ApiTags('Products')
//@ApiExcludeController()  //excluye el controlador de swagger
@Controller("products")
//@UseGuards(AuthGuard)
export class ProductsController{
    constructor (private readonly productsService: ProductsService){

    }
    @Get()
    getProducts(){
        return this.productsService.getProducts();
    }
    @ApiOperation({ summary: 'Return list of all entries', description: 'list entries' })
    @Get('entries')
    getAllEntries(){
        return this.productsService.getAllEntries();
    }

    @ApiOperation({ summary: 'Get product by name using like', description: '' })
    @Get('search')
    searchProducts(@Query('name') name: string) {
        return this.productsService.findByName(name);
    }

    @Get(':barcode')
    getProduct(@Param('barcode') barcode: string){

        return this.productsService.geProduct(barcode);
    }
    @Post()
    createProduct(@Body() createProductDto : CreateProductDto){
        return this.productsService.createProduct(createProductDto);
    }
    @ApiOperation({ summary: 'update image url ', description: 'update the image to a url in the cloud, protected route for Admin' })
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Patch('files/uploadImage/:id')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(@Param('id',ParseIntPipe) id:number, @UploadedFile() file : Express.Multer.File){
        return this.productsService.uploadImage(id,file);
    }

    @Patch(':barcode')
    @ApiOperation({summary: 'Update product', description: 'Update an existing product by id'})
    updateProduct(@Param('barcode')barcode: string, @Body()updateProductDto: UpdateProductDto){

        return this.productsService.updateProduct(barcode, updateProductDto)
    }
    @Delete()
    @ApiExcludeEndpoint()
    deleteUser(){
        return "este endpoint borra un usuario";
    }

    
}