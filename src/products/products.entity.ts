import { Category } from "src/categories/entities/category.entity";
import { OrderDetail } from "src/order-details/entities/order-detail.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entry } from "./entriy.entity";
//import { Package } from "./package.entity";
import { PackageProduct } from "./package-product.entity";


@Entity({
    name: 'products'
})
export class Product{
    @PrimaryGeneratedColumn()
    id: number;   
    @Column()
    name:string;
    @Column()
    description: string;
    @Column({unique: true})
    barcode: string;

     @Column('decimal', { precision: 10, scale: 2 })
    price: number;  //precio venta 
    @Column()
    stock: number;  //cantidad de productos.  saldo
    @Column()
    imgUrl: string;
    @Column()
    categoryId : number;
    @Column()
    howToSell: string;  //como se vende pieza o paquete o granel
    @Column('decimal', { precision: 10, scale: 2 })
    purchasePrice: number; // precio de compra.
    @Column('decimal', { precision: 10, scale: 2 })
    wholesalePrice: number  // precio venta de mayoreo

     @Column()
    stocktaking: boolean; //true si se usa inventario
    @Column()
    minimumStock: number;  //stcok minimo
    @Column()
    entriy: number; // entrada de productos
    @Column()
    output: number; //salida de productos
    
   @ManyToOne(() => Category, (category) => category.Products)
   category: Category


   @OneToMany(() => Entry, (entry) => entry.product)
   entries: Entry[]


       // Relación 1:N con OrderDetail
       @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
       orderDetails: OrderDetail[];

     //  @ManyToMany(() => Package, (packageEntity) => packageEntity.products)
     //  packages: Package[];

     @OneToMany(() => PackageProduct, (packageProduct) => packageProduct.product)
     packageProducts: PackageProduct[];

}