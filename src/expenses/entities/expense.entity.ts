import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ExpenseNames } from "./expense-names.entity"


@Entity({
    name : 'expenses'
})
export class Expense {
    @PrimaryGeneratedColumn()
    id: string
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number
    @Column('date')
    date: Date
    @Column()
    description : string
    @Column()
    expenseNamesId : number

    @ManyToOne(() => ExpenseNames, (expenseNames) => expenseNames.expenses)
    expenseNames: ExpenseNames
}
