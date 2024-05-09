import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Products } from 'src/entities/products.entity';
import { Orders } from 'src/entities/orders.entity';
import { OrderDetails } from 'src/entities/orderDetails.entity';
import { Categories } from 'src/entities/categories.entity';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Products,
      Orders,
      OrderDetails,
      Categories,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, ProductsService],
})
export class OrdersModule {}
