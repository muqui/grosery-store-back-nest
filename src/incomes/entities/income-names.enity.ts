import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Income } from "./income.entity";
@Entity({
    name: 'income_names'
})
export class IncomeNames {
    @PrimaryGeneratedColumn()
    id: number;   
    @Column()
    name : string
    @OneToMany(() => Income, (income) => income.incomeNames)
    Incomes: Income[] 
}