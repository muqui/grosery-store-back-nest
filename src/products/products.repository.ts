import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ILike, Like, Repository } from "typeorm";
import { CreateProductDto } from "./create-product.dto";
import { CloudinaryService } from "src/users/cloudinary.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Entry } from "./entriy.entity";
import { EntryDto } from "./dto/entry.dto";
//import { PackageProductService } from "./package-product.service";
import { PackageProduct } from "./package-product.entity";
//import { Package } from "./package.entity";
//import { PackagesService } from "./package.service";

@Injectable()
export class ProductsRepository {
    

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository
            (Entry) private readonly entryRepository: Repository<Product>,


        @InjectRepository(PackageProduct)
        private readonly packageProductRepository: Repository<PackageProduct>,

        private readonly cloudinaryService: CloudinaryService,




    ) { }

    async getProductsInventory(categoryName?: string) {
        const queryBuilder = this.productRepository
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.category', 'category') // Relación con categoría
          .select([
            'product.barcode',
            'product.id',
            'product.name',
            'product.purchasePrice',
            'product.entriy',
            'product.output',
            'product.stock',
            'product.price',
            'category.id',
            'category.name',
          ]);
      
        // Si se envía un nombre de categoría, aplica el filtro
        if (categoryName) {
          queryBuilder.where('category.name = :categoryName', { categoryName });
        }
      
        // Obtiene los productos
        const products = await queryBuilder.getMany();
      
        // Calcula el costo total del inventario (precio * stock)
        const totalInventoryCost = products.reduce(
          (total, product) => total + Number(product.purchasePrice) * Number(product.stock),
          0,
        );
      
        // Retorna los productos y el costo total
        return {
          categoryName: categoryName || 'All categories',
          totalInventoryCost,
          products,
        };
      }
               

    async getProducts() {
        //return this.products;

        return this.productRepository.find()
    }
    /**
     * Crea el producto y el registro para el inventario
     * @param createProductDto 
     * @returns 
     */

    async createProduct(createProductDto: CreateProductDto) {
        // Validar si el producto ya existe basado en algún campo único como 'barcode'
        const existingProduct = await this.productRepository.findOne({
            where: { barcode: createProductDto.barcode }
        });
        // console.log("existe el producto= " + createProductDto.howToSell)
        // console.log(existingProduct)
        if (existingProduct) {
            throw new ConflictException('product exists');
        }
        // Primero, crea el producto
        console.log("CREAR PRODUCTO barcode" + createProductDto.barcode);
        const product = await this.productRepository.save(createProductDto);



        // Si el producto es un paquete
        if (createProductDto.howToSell === 'Paquete') {
            // Asegúrate de que los campos necesarios están presentes
            if (!createProductDto.packageContents || createProductDto.packageContents.length === 0) {
                throw new BadRequestException('Paquete debe contener productos.');
            }

            // Recupera los productos incluidos en el paquete
            const includedProducts = await this.productRepository.findByIds(createProductDto.packageContents.map(item => item.productId));

            // Verifica que todos los productos existan
            if (includedProducts.length !== createProductDto.packageContents.length) {
                throw new BadRequestException('Algunos productos no existen.');
            }

            // Crea los registros de paquetes de productos
            for (const item of createProductDto.packageContents) {
                const packageProduct = new PackageProduct();
                packageProduct.productId = item.productId; // ID del producto incluido en el paquete
                packageProduct.quantity = item.quantity; // Cantidad de este producto en el paquete
                packageProduct.packageId = product.id; // ID del paquete, que es el mismo que el ID del producto recién creado
                await this.packageProductRepository.save(packageProduct);
            }
        } else {
            console.log("lo que se guarda")
            // Para productos que no son paquetes
            let purchaseTotalPrice = createProductDto.purchasePrice * createProductDto.stock;
            const entry = {
                supplier: createProductDto.supplier,
                amount: product.stock,
                productId: product.id,
                purchasePrice: product.purchasePrice,  // precio compra
                purchaseTotalPrice: purchaseTotalPrice,
            };

            console.log(entry)

            await this.entryRepository.save(entry);
        }

        return product;
    }


    async getProduct(barcode: string) {
        const productFound = await this.productRepository.findOne({  // busca si el usuario existe.
            where: {
                barcode
            }
        })
        if (!productFound) {
            throw new NotFoundException('Product does not exist');
        }
        return productFound;
    }

    async uploadImage(id: number, file: Express.Multer.File) {

        //  return  this.cloudinaryService.upladImage(file);

        const productFound = await this.productRepository.findOne({  // busca si el usuario existe.
            where: {
                id
            }
        })
        if (!productFound) {
            return new HttpException('Product not Found', HttpStatus.NOT_FOUND)
        }

        const saveFile = await this.cloudinaryService.upladImage(file);
        // Actualizar el producto con la URL de la imagen subida
        productFound.imgUrl = saveFile.secure_url; // Asumiendo que saveFile.secure_url contiene la URL de la imagen

        // Guardar los cambios en la base de datos
        await this.productRepository.save(productFound);
        console.log(saveFile)
        return {
            message: 'Imagen subida y producto actualizado',
            product: productFound
        };
    }

    findByName(name: string) {
        console.log("busqueda por nombre= " + name)
        return this.productRepository.find({
            where: {
                name: ILike(`%${name}%`)
            }
        });
    }

    async getAllEntries(): Promise<any[]> {
        return this.entryRepository.createQueryBuilder('entry')
            .innerJoinAndSelect('entry.product', 'product')
            .select([
                'entry.id',
                'entry.supplier',
                'entry.date',
                'entry.amount',
                'entry.purchasePrice',
                'entry.purchaseTotalPrice',
                'product.id',
                'product.name',
                'product.barcode'
            ])
            .getMany();
    }

    async addToinvenory(barcode: string, updateProductDto: UpdateProductDto) {
        // Encuentra el producto por el código de barras
        console.log(updateProductDto)

        const product = await this.productRepository.findOne({
            where: { barcode }
        });
        //  console.log(`PRODUCTO desde base A stock ${product.stock} entradas = ${product.entriy} Salidas = ${product.output}`)
        //  console.log(`datos que se envian         ${updateProductDto.stock} entradas = ${updateProductDto.entriy} Salidas = ${updateProductDto.output}`)
        if (!product) {
            throw new NotFoundException('Product does not exist');
        }
        console.log("productos que hay" + product.stock);
        console.log("productos por agregar " + updateProductDto.entriy);
        console.log("precio de compra: " + product.purchasePrice);
        console.log("Nuevo precio de compra " + updateProductDto.purchasePrice);
        // Calcula el nuevo precio promedio ponderado
const currentStock = Number(product.stock) || 0; // Stock actual
const newStock = Number(updateProductDto.entriy) || 0; // Nuevos productos a agregar
const currentPrice = Number(product.purchasePrice) || 0; // Precio de compra actual
const newPrice = Number(updateProductDto.purchasePrice) || 0; // Nuevo precio de compra

const totalStock = parseFloat((currentStock + newStock).toFixed(2));
const averagePurchasePrice = parseFloat(
  (
    (currentStock * currentPrice + newStock * newPrice) /
    (totalStock || 1) // Evitar división por cero
  ).toFixed(2)
);
        


        // const entriy = parseFloat((updateProductDto.entriy + product.entriy).toFixed(2));
        const stock = parseFloat((Number(updateProductDto.stock) + Number(updateProductDto.entriy)).toFixed(2));

        const entriyValue = Number(updateProductDto.entriy) || 0;
        const productEntriyValue = Number(product.entriy) || 0;

        const entriy = parseFloat((entriyValue + productEntriyValue).toFixed(2));
        console.log(`Stock ${stock}`)
        console.log("precio promediado ", averagePurchasePrice)
       
        // Actualiza el producto con los campos proporcionados en el DTO
        await this.productRepository.update(product.id, {
            description: updateProductDto.description,
            price: updateProductDto.price,
            stock: stock,
            imgUrl: updateProductDto.imgUrl,
            name: updateProductDto.name,
            categoryId: updateProductDto.categoryId,
            barcode: updateProductDto.barcode,
            howToSell: updateProductDto.howToSell,
            purchasePrice:  averagePurchasePrice, //purchasePrice: updateProductDto.purchasePrice,
            wholesalePrice: updateProductDto.wholesalePrice,
            stocktaking: updateProductDto.stocktaking,
            minimumStock: updateProductDto.minimumStock,
            entriy: entriy,
            // output: updateProductDto.output
        });


        // let purchaseTotalPrice = updateProductDto.purchasePrice * updateProductDto.stock;
        const purchaseTotalPrice = parseFloat((updateProductDto.entriy * updateProductDto.purchasePrice).toFixed(2));

        const entry = {
            supplier: updateProductDto.supplier,
            amount: updateProductDto.entriy,
            productId: product.id,
            purchasePrice: updateProductDto.purchasePrice,  // precio compra
            purchaseTotalPrice: purchaseTotalPrice,
        };
        await this.entryRepository.save(entry);

        // Actualiza los productos en el paquete si el producto es un paquete
        if (updateProductDto.howToSell === 'Paquete' && updateProductDto.packageContents) {
            // Primero elimina los productos del paquete anteriores
            await this.packageProductRepository.delete({ packageId: product.id });

            // Luego, guarda los nuevos productos del paquete
            for (const item of updateProductDto.packageContents) {
                const packageProduct = new PackageProduct();
                packageProduct.productId = item.productId;
                packageProduct.quantity = item.quantity;
                packageProduct.packageId = product.id; // ID del paquete es el ID del producto actualizado
                await this.packageProductRepository.save(packageProduct);
            }
        }

        // Devuelve el producto actualizado
        console.log(`Lo que  SE ENVIO A ACTIUALIZAR ${updateProductDto.entriy}`)
        return this.productRepository.findOne({ where: { barcode } });
    }

    async updateProduct(barcode: string, updateProductDto: UpdateProductDto) {
        // Encuentra el producto por el código de barras

        const product = await this.productRepository.findOne({
            where: { barcode }
        });
        console.log(`PRODUCTO desde base A stock ${product.stock} entradas = ${product.entriy} Salidas = ${product.output}`)
        console.log(`datos que se envian         ${updateProductDto.stock} entradas = ${updateProductDto.entriy} Salidas = ${updateProductDto.output}`)
        if (!product) {
            throw new NotFoundException('Product does not exist');
        }

        // Actualiza el producto con los campos proporcionados en el DTO
        await this.productRepository.update(product.id, {
            description: updateProductDto.description,
            price: updateProductDto.price,
            stock: updateProductDto.stock,
            imgUrl: updateProductDto.imgUrl,
            name: updateProductDto.name,
            categoryId: updateProductDto.categoryId,
            barcode: updateProductDto.barcode,
            howToSell: updateProductDto.howToSell,
            purchasePrice: updateProductDto.purchasePrice, 
            wholesalePrice: updateProductDto.wholesalePrice,
            stocktaking: updateProductDto.stocktaking,
            minimumStock: updateProductDto.minimumStock,
            entriy: updateProductDto.entriy,
            // output: updateProductDto.output
        });


        let purchaseTotalPrice = updateProductDto.purchasePrice * updateProductDto.stock;


        // Actualiza los productos en el paquete si el producto es un paquete
        if (updateProductDto.howToSell === 'Paquete' && updateProductDto.packageContents) {
            // Primero elimina los productos del paquete anteriores
            await this.packageProductRepository.delete({ packageId: product.id });

            // Luego, guarda los nuevos productos del paquete
            for (const item of updateProductDto.packageContents) {
                const packageProduct = new PackageProduct();
                packageProduct.productId = item.productId;
                packageProduct.quantity = item.quantity;
                packageProduct.packageId = product.id; // ID del paquete es el ID del producto actualizado
                await this.packageProductRepository.save(packageProduct);
            }
        }

        // Devuelve el producto actualizado
        return this.productRepository.findOne({ where: { barcode } });
    }

}