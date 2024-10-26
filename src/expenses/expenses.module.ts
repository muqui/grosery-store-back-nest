import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseNames } from './entities/expense-names.entity';
import { Expense } from './entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseNames ])], // importamos las entidades
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
