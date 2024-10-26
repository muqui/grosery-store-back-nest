import { Order } from "src/orders/entities/order.entity";
import { BeforeInsert, Column, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { v4 as uuidv4 } from 'uuid';

@Entity({
    name: 'users'
})
export class User{
  
    @PrimaryGeneratedColumn()
    id: string;
   
    @Column({ unique: true })
    email: string;
    @Column( {unique: true})
    name: string;
    @Column()
    password: string;
    @Column()
    address: string;
    @Column()
    phone: string;
    @Column()
    country: string;
    @Column()
    city: string;
    @Column({default: false})
    isAdmin: boolean;


    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]


   // orders_id: Relación 1:N con orders.
}