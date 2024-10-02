import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeNames } from './entities/income-names.enity';
import { Income } from './entities/income.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Income, IncomeNames ])], // importamos las entidades
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
