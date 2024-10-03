import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity({
    name: 'package_products'
})
export class PackageProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.packageProducts)
    product: Product;

    @Column()
    productId: number; // ID del producto asociado

    @Column()
    quantity: number; // Cantidad de este producto en el paquete

    

       // Relación con el producto que representa el paquete
       @ManyToOne(() => Product, (product) => product.packageProducts)
       package: Product;

    @Column()
    packageId: number; // ID del paquete al que pertenece este producto
}
