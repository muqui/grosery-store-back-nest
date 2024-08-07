import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { Product } from "./products.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryConfig } from "src/config/cloudinary";
import { CloudinaryService } from "src/users/cloudinary.service";
import { Entry } from "./entriy.entity";

import { PackageProduct } from "./package-product.entity";
//import { PackageProductService } from "./package-product.service";
//import { PackagesService } from "./package.service";
//import { Package } from "./package.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Entry, PackageProduct])],
    providers:[ProductsService, ProductsRepository, CloudinaryConfig, CloudinaryService],
    controllers: [ProductsController],
    exports:[TypeOrmModule]
})

export class ProductsModule{}