import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { OrderDetailsModule } from 'src/order-details/order-details.module';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { IncomeNames } from 'src/incomes/entities/income-names.enity';
import { Income } from 'src/incomes/entities/income.entity';
import { Entry } from 'src/products/entriy.entity';
import { ExpenseNames } from 'src/expenses/entities/expense-names.entity';
import { Expense } from 'src/expenses/entities/expense.entity';

@Module({
  imports: [   OrderDetailsModule, TypeOrmModule.forFeature([OrderDetail, Category, IncomeNames, Income, Entry, ExpenseNames, Expense])
   ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
