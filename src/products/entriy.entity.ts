import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products.entity";

@Entity({
    name: 'entries'
})
export class Entry{
    @PrimaryGeneratedColumn()
    id: number;  

    @Column()
    supplier: string

    @Column({type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    date: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    purchasePrice: number;   //precio de compra

    @Column('decimal', { precision: 10, scale: 2 })
    purchaseTotalPrice: number;   //precio total de la compra

   @Column()
   productId: number;

    @ManyToOne(() => Product, (product) => product.entries)
    product: Product



}