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
  ) { }

  create(createIncomeDto: CreateIncomeDto) {
    return this.incomeRepository.save(createIncomeDto)
  }

  async findAll() {
    return await this.incomeRepository.find();
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
      where: {
        name: createIncomeNameDto.name
      }
    })
    if (IncomeNameFound) {
      // return  new HttpException('Category already exist', HttpStatus.CONFLICT)
      throw new ConflictException('Income name exists');
    }
    return this.incomeNamesRepository.save(createIncomeNameDto)
  }

  async findAllNames() {
    return this.incomeNamesRepository.find();
  }

  async findAllFilter(startDate: string, endDate: string, name: string) {
    console.log(`FEcha Inicio= ${startDate} Fecha fin ${endDate}  Nombre = ${name}`)
    const incomesFilter = await this.incomeRepository.createQueryBuilder('income')
      .innerJoinAndSelect('income.incomeNames', 'incomenames')
      .select([
        'income.description',
        'income.date',
        'income.amount',
        'incomenames.name'
      ])
      .addSelect('SUM(income.amount)', 'totalAmount') // Agregamos la sumatoria de income.amount
      .where('income.date >= :startDate', { startDate })
      .andWhere('income.date <= :endDate', { endDate })
      .andWhere('incomenames.name ILIKE :name', { name: `%${name}%` })
      .groupBy('income.id, incomenames.id') // Agrupamos los resultados
      .getRawAndEntities(); // Devuelve tanto los resultados agregados como las entidades originales
    // Calculamos la suma total desde los resultados 'raw'
    const totalAmount = incomesFilter.raw.reduce((sum, current) => sum + parseFloat(current.totalAmount), 0).toFixed(2);

    return {
      incomes: incomesFilter.entities,
      totalAmount
    };

  }

}
