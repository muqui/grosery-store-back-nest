import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Product } from 'src/products/products.entity';
import { PackageProduct } from 'src/products/package-product.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(PackageProduct) private packageProductRepository: Repository<PackageProduct>
  ){}
  async create(createOrderDto: CreateOrderDto) {
    const { userId, orderDetails } = createOrderDto;
  
    // Crear nueva orden y asignar usuario
    const order = new Order();
    order.user = { id: userId } as any; // Asume que solo necesitas el id del usuario
  
    // Procesar cada OrderDetail y actualizar el stock y output del producto o productos del paquete
    order.orderDetails = await Promise.all(orderDetails.map(async detailDto => {
      const orderDetail = new OrderDetail();
      orderDetail.price = detailDto.price;
      orderDetail.amount = detailDto.amount;
      orderDetail.purchasePrice = detailDto.purchasePrice;
  
      // Buscar el producto asociado
      // Find the product and its associated package products


      const product = await this.productRepository.findOne({
        where: { id: detailDto.productId },
        relations: ['packageProducts', 'packageProducts.product', 'packageProducts.package'],
      });

      console.log(product)
      
     

      

     
      if (!product) {
        throw new NotFoundException(`Product with ID ${detailDto.productId} not found`);
      }
      
      // Si el producto se vende como paquete, descontar los productos del paquete
      if (product.howToSell === 'Paquete') {
        
        // Recorrer los productos del paquete y descontar su stock
        for (const packageProduct of product.packageProducts) {
        
          const includedProduct = await this.productRepository.findOneBy({ id: packageProduct.productId });
          console.log(`Producti incluido en el paquete:  ${includedProduct.id}`)
         
          if (!includedProduct) {
            throw new NotFoundException(`Product included in the package with ID ${packageProduct.productId} not found`);
          }
  
          // Descontar la cantidad proporcional al número de paquetes vendidos
          const totalAmountToDiscount1 = packageProduct.quantity * orderDetail.amount;
          const totalAmountToDiscount = 1;
          console.log(`cantidad a descontar = ${typeof(totalAmountToDiscount1)} `)
  
          includedProduct.stock -= totalAmountToDiscount1;
  
          // Asegurarse de que el stock no sea negativo
          if (includedProduct.stock < 0) {
            throw new BadRequestException(`Insufficient stock for product ${includedProduct.name} in package`);
          }
  
          // Sumar la cantidad al campo output del producto
          includedProduct.output += totalAmountToDiscount;
  
          // Guardar los cambios del stock y output en la base de datos
          await this.productRepository.save(includedProduct);
  
          console.log(`Stock and output updated for product ${includedProduct.name}, new stock: ${includedProduct.stock}, new output: ${includedProduct.output}`);
          
        }
      } else {
        // Descontar el stock si el producto no es un paquete
        product.stock -= orderDetail.amount;
  
        // Asegurarse de que el stock no sea negativo
        if (product.stock < 0) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }
  
        // Sumar la cantidad al campo output del producto
        product.output += orderDetail.amount;
  
        // Guardar los cambios del stock y output en la base de datos
        await this.productRepository.save(product);
  
        console.log(`Stock and output updated for product ${product.name}, new stock: ${product.stock}, new output: ${product.output}`);
      }
  
      // Asignar el producto al detalle de la orden
      orderDetail.product = product;
  
      return orderDetail;
    }));
  
    // Guardar la orden completa en la base de datos
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
