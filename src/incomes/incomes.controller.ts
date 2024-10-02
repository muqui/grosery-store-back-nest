import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateIncomeNameDto } from './dto/create-income-name.dto';
import { CapitalizeFirstLetterInterceptor } from './interceptor/lowercase.interceptor.ts/lowercase.interceptor.ts.interceptor';


@ApiTags('Incomes')
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.create(createIncomeDto);
  }

  @Get()
  findAll() {
    return this.incomesService.findAll();
  }

  @UseInterceptors(CapitalizeFirstLetterInterceptor)
  @Post('name') 
  createName(@Body() createIncomeNameDto: CreateIncomeNameDto){
    return this.incomesService.createName(createIncomeNameDto);
  }



  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomesService.update(+id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomesService.remove(+id);
  }
  */
}
