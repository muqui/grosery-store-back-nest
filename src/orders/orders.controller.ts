import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Product } from 'src/products/products.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';



@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
 // @Roles(Role.Admin)
  @ApiOperation({ summary: 'created order ', description: ' protected route for Admin' })
  //@UseGuards(AuthGuard,RolesGuard)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.getSoldProducts();
  }

  @Get('sold')
  getSoldProducts(): any {
    return this.ordersService.getSoldProducts();
   
  }

  //filtro por rango de fecha y Id usuario y departamento
   @Get('solds')
   getSoldProductsByName(
  @Query('startDate') startDate: string, 
  @Query('endDate') endDate: string, 
  @Query('userName') userName: string = '',
  @Query('departmentName') departmentName: string =''
): any {
  return this.ordersService.getSoldProductsByDateAndIDUser(startDate, endDate, userName, departmentName);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  


}
