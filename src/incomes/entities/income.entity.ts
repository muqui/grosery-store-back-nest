import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IncomeNames } from "./income-names.enity";
@Entity({
    name : 'incomes'
})
export class Income {
    @PrimaryGeneratedColumn()
    id: string
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number
    @Column('date')
    date: Date
    @Column()
    description : string
    @Column()
    incomeNamesId : number
    @ManyToOne(() => IncomeNames, (incomeNames) => incomeNames.Incomes)
    incomeNames: IncomeNames

}
