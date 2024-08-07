import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Product } from 'src/products/products.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>
  ){}

 async create(createOrderDto: CreateOrderDto) {
  const { userId, orderDetails } = createOrderDto;

  const order = new Order();
  order.user = { id: userId } as any; // Asume que solo necesitas el id del usuario

  order.orderDetails = await Promise.all(orderDetails.map(async detailDto => {
    const orderDetail = new OrderDetail();
    orderDetail.price = detailDto.price;
    orderDetail.amount = detailDto.amount;
    orderDetail.purchasePrice = detailDto.purchasePrice
    orderDetail.product = await this.productRepository.findOneBy({ id: detailDto.productId }); // Usar findOneBy
    return orderDetail;
  }));

  return this.orderRepository.save(order);
  
  }

    // Método para obtener productos vendidos
    async getSoldProducts(): Promise<any[]> {
      

      return this.orderRepository.createQueryBuilder('order')
      .innerJoinAndSelect('order.orderDetails', 'orderDetail')
      .innerJoinAndSelect('orderDetail.product', 'product') // Corregir a product
      .innerJoinAndSelect('order.user', 'user')
      .select([
        'order.id',
        'order.date',
        'user.id',
        'user.name',
        'orderDetail.id',
        'orderDetail.price',
        'orderDetail.amount', // Incluye amount en la selección
        'orderDetail.purchasePrice', //precio costo del producto
        'product.id',
        'product.name',
        'product.description',
        'product.barcode',
        'product.price',
        'product.stock',
        'product.imgUrl',
        'product.categoryId'
      ])
      .getMany();


    } 
 

   
  findAll() {
    return `This action returns all orders`;
  }

  findOne(orderId: number) {
    return this.orderRepository.createQueryBuilder('order')
    .innerJoinAndSelect('order.orderDetails', 'orderDetail')
    .innerJoinAndSelect('orderDetail.product', 'product')
    .innerJoinAndSelect('order.user', 'user')
    .select([
      'order.id',
      'order.date',
      'user.id',
      'user.name',
      'orderDetail.id',
      'orderDetail.price',
      'orderDetail.amount',
      'orderDetail.purchasePrice',
      'product.id',
      'product.name',
      'product.description',
      'product.barcode',
      'product.price',
      'product.stock',
      'product.imgUrl',
      'product.categoryId'
    ])
    .where('order.id = :orderId', { orderId })
    .getMany();

  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
