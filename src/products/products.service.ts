import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto } from "./create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService{
   
    
    constructor (private productsRepository: ProductsRepository){}
    getProducts(){
        return this.productsRepository.getProducts();
    }

    createProduct(createProductDto : CreateProductDto) {
        return this.productsRepository.createProduct(createProductDto)
    }

    
    
    async geProduct(barcode: string) {
       return this.productsRepository.getProduct(barcode)
    }
   
    uploadImage(id: number, file: Express.Multer.File) {
        return this.productsRepository.uploadImage(id, file);
    }
    updateProduct(barcode: string, updateProductDto: UpdateProductDto) {
        return this.productsRepository.updateProduct(barcode, updateProductDto);
    }

    findByName(name: string) {
       return this.productsRepository.findByName(name);
    }

    getAllEntries() {
        return this.productsRepository.getAllEntries();
    }

    
}