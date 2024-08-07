import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';

@Entity({
    name: 'package_products'
})
export class PackageProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.packageProducts, { eager: true })
    product: Product;

    @Column()
    productId: number; // ID del producto asociado

    @Column()
    quantity: number; // Cantidad de este producto en el paquete

    

    @Column()
    packageId: number; // ID del paquete al que pertenece este producto
}
