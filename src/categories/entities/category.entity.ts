import { OrderDetail } from "src/order-details/entities/order-detail.entity";
import { Product } from "src/products/products.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categories'
})
export class Category {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({unique: true})
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    Products: Product[]

    //Relación 1:1 con products.

  
}
