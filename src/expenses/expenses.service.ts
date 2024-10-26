import { ConflictException, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CreateExpenseNameDto } from './dto/create-expense-name.dto';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { ExpenseNames } from './entities/expense-names.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpensesService {
  

  constructor(
    @InjectRepository(ExpenseNames) private expenseNamesRepository: Repository<ExpenseNames>,
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>
){}

 
  create(createExpenseDto: CreateExpenseDto) {
    return this.expenseRepository.save(createExpenseDto)
  }

  async findAllFilter(startDate: string, endDate: string, name: string) {
    console.log(`FEcha Inicio= ${startDate} Fecha fin ${endDate}  Nombre = ${name}`)
    const expensesFilter = await this.expenseRepository.createQueryBuilder('expense')
      .innerJoinAndSelect('expense.expenseNames', 'expenseNames')
      .select([
        'expense.description',
        'expense.date',
        'expense.amount',
        'expenseNames.name'
      ])
      .addSelect('SUM(expense.amount)', 'totalAmount') // Agregamos la sumatoria de income.amount
      .where('expense.date >= :startDate', { startDate })
      .andWhere('expense.date <= :endDate', { endDate })
      .andWhere('expenseNames.name ILIKE :name', { name: `%${name}%` })
      .groupBy('expense.id, expenseNames.id') // Agrupamos los resultados
      .getRawAndEntities(); // Devuelve tanto los resultados agregados como las entidades originales
    // Calculamos la suma total desde los resultados 'raw'
    const totalAmount = expensesFilter.raw.reduce((sum, current) => sum + parseFloat(current.totalAmount), 0).toFixed(2);

    return {
      expenses: expensesFilter.entities,
      totalAmount
    };
  }
 

  findAll() {
    return `This action returns all expenses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }

  //expenses NAme
  async createName(createExpenseNameDto: CreateExpenseNameDto) {
     //buscamos si existe en nombre del ingreso
     const IncomeNameFound = await this.expenseNamesRepository.findOne({
      where:{
        name :  createExpenseNameDto.name
      }
    })
    if(IncomeNameFound){
      // return  new HttpException('Category already exist', HttpStatus.CONFLICT)
      throw new ConflictException('Expense name exists');
     }
    return this.expenseNamesRepository.save(createExpenseNameDto)
    
  }

  findAllNames() {
   
    return this.expenseNamesRepository.find();
  }
  
}
