import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

constructor(@InjectRepository(Category) private readonly categoryRepository : Repository<Category>){}

  async create(createCategoryDto: CreateCategoryDto) {
    //buscamos si la categoria existe
    const categoryFound = await this.categoryRepository.findOne({
        where:{
          name :  createCategoryDto.name
        }
    })

    if(categoryFound){
      return  new HttpException('Category already exist', HttpStatus.CONFLICT)
    }
    // const saveCategory = Object.assign( createCategoryDto.name.toLocaleUpperCase, createCategoryDto)

    // console.log(saveCategory);
     return this.categoryRepository.save(createCategoryDto)
  }

  findAll() {
    return this.categoryRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
