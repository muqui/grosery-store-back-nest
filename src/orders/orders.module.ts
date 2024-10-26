import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailsModule } from 'src/order-details/order-details.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';

@Module({
  imports: [  ProductsModule, OrderDetailsModule,
    TypeOrmModule.forFeature([Order, OrderDetail]),
  forwardRef(() => OrderDetailsModule),
  UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
