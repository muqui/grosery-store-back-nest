import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Expense } from "./expense.entity";

@Entity({
    name: 'expense_names'
})
export class ExpenseNames {
    @PrimaryGeneratedColumn()
    id: number;   
    @Column()
    name : string
    @OneToMany(() => Expense, (expense) => expense.expenseNames)
    expenses: Expense[] 
}