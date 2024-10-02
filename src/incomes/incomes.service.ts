import { ConflictException, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomeNames } from './entities/income-names.enity';
import { Repository } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeNameDto } from './dto/create-income-name.dto';

@Injectable()
export class IncomesService {
  
 
  constructor(
    @InjectRepository(IncomeNames) private incomeNamesRepository: Repository<IncomeNames>,
    @InjectRepository(Income) private incomeRepository: Repository<Income>
){}

  create(createIncomeDto: CreateIncomeDto) {
    return 'This action adds a new income';
  }

  findAll() {
    return `This action returns all incomes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} income`;
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return `This action updates a #${id} income`;
  }

  remove(id: number) {
    return `This action removes a #${id} income`;
  }

  //Metodos incomes Name

  async createName(createIncomeNameDto: CreateIncomeNameDto) {
    //buscamos si existe en nombre del ingreso
    const IncomeNameFound = await this.incomeNamesRepository.findOne({
      where:{
        name :  createIncomeNameDto.name
      }
    })
    if(IncomeNameFound){
      // return  new HttpException('Category already exist', HttpStatus.CONFLICT)
      throw new ConflictException('Income name exists');
     }
    return this.incomeNamesRepository.save(createIncomeNameDto)
  }
  
}
