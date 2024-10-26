import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Product } from 'src/products/products.entity';
import { PackageProduct } from 'src/products/package-product.entity';

//import dayjs, { extend } from 'dayjs';

import { startOfDay, endOfDay, parseISO } from 'date-fns'; // Importa las funciones necesarias de date-fns
const dayjs = require('dayjs');





@Injectable()
export class OrdersService {


  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>, //order details
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(PackageProduct) private packageProductRepository: Repository<PackageProduct>
  ) { }
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

        console.log(`Producti incluido en el paquete:  `)

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
          console.log(`cantidad a descontar = ${typeof (totalAmountToDiscount1)} `)

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
    const orders = await this.orderRepository.createQueryBuilder('order')
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
        'orderDetail.purchasePrice', // precio costo del producto
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

    // Sobrescribir el campo 'date' con un valor formateado
    orders.forEach(order => {
      // Sobrescribimos la propiedad con el valor formateado
      //(order.date as unknown) = dayjs(order.date).format('YYYY-MM-DD HH:mm:ss');
      // (order.date as unknown) = dayjs(order.date).format('HH:mm:ss DD-MM-YYYY ');
    });

    return orders;
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

  //Promise<Order[]>
  async getSoldProductsByDateAndIDUser(
    startDate: string,
    endDate: string,
    userName: string,
    departmentName: string
  ): Promise<any> {

    // Establecer la fecha de inicio y final con la zona horaria correcta
    const startOfDayDate = startOfDay(parseISO(startDate)); // 00:00:00 de la fecha de inicio
    const endOfDayDate = endOfDay(parseISO(endDate));       // 23:59:59 de la fecha de fin

    console.log(`Fecha inicio: ${startOfDayDate}, Fecha fin: ${endOfDayDate} categoria::::: ${departmentName}`);

    if(departmentName === "todos los departamentos"){
      departmentName = "";  //si departamento es vacio, muestra todos los departamentos
    }
    if(userName === "todos los usuarios"){
      userName = "";
    }


    // Obtener los detalles de la orden junto con la sumatoria de los precios
    const orderDetailsWithTotals = await this.orderDetailRepository.createQueryBuilder('orderDetail')
      .innerJoinAndSelect('orderDetail.order', 'order')
      .innerJoinAndSelect('orderDetail.product', 'product')
      .innerJoinAndSelect('product.category', 'category')
      .innerJoinAndSelect('order.user', 'user')
      .select([
        'order.id',
        'order.date',
        'user.id',
        'user.name',
        'category.id',
        'category.name',
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
        'product.categoryId',
      ])
      .addSelect('SUM(orderDetail.price)', 'totalPrice') // Sumatoria de los precios de venta
      .addSelect('SUM(orderDetail.purchasePrice)', 'totalPurchasePrice') // Sumatoria de los precios de costo
      .where('order.date >= :startDate', { startDate: startOfDayDate })
      .andWhere('order.date <= :endDate', { endDate: endOfDayDate })
      .andWhere('user.name ILIKE :userName', { userName: `%${userName}%` })
      .andWhere('category.name ILIKE :departmentName', { departmentName: `%${departmentName}%` })
      .groupBy('order.id, user.id, category.id, orderDetail.id, product.id') // Agrupamos los resultados
      .getRawAndEntities(); // Devuelve tanto los resultados agregados como las entidades originales

    // Extraer las sumas de totalPrice y totalPurchasePrice y formatearlas a dos decimales
const totalPrice = parseFloat(orderDetailsWithTotals.raw
  .reduce((sum, current) => sum + parseFloat(current.totalPrice), 0)
  .toFixed(2));

const totalPurchasePrice = parseFloat(orderDetailsWithTotals.raw
  .reduce((sum, current) => sum + parseFloat(current.totalPurchasePrice), 0)
  .toFixed(2));
    // Calcular la ganancia (profit)
    const profit = parseFloat((totalPrice - totalPurchasePrice).toFixed(2));
    // Formatear las fechas de las órdenes
    orderDetailsWithTotals.entities.forEach(orderDetail => {
      (orderDetail.order.date as unknown) = dayjs(orderDetail.order.date).format('DD-MM-YYYY HH:mm');
     });

    console.log(`total venta = ${totalPrice}, total costo = ${totalPurchasePrice}, ganancia = ${profit}`);

    return {
      orderDetails: orderDetailsWithTotals.entities,
      totalPrice,         // Total de venta
      totalPurchasePrice, // Total de costo
      profit              // Ganancia (totalPrice - totalPurchasePrice)
    };
  }




}
