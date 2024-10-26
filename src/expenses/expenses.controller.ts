import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateExpenseNameDto } from './dto/create-expense-name.dto';


@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  findAllFilter(@Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('name') name: string = ''){
      return this.expensesService.findAllFilter(startDate, endDate, name);
  }

  //Expenses NAME
  @Post('name')
  createName(@Body() createExpenseNameDto: CreateExpenseNameDto) {
    return this.expensesService.createName(createExpenseNameDto);
  }

  @Get('name')
  findAllNames() {
    return this.expensesService.findAllNames();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
  

}
