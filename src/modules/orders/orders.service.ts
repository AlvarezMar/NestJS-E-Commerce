import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails } from '../../entities/orderDetails.entity';
import { Orders } from '../../entities/orders.entity';
import { Products } from '../../entities/products.entity';
import { Users } from '../../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  getOrder(id: string): Promise<Orders> {
    const order = this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: { products: true },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async addOrder(
    userId: string,
    products: Partial<Products[]>,
  ): Promise<Orders[]> {
    let total = 0;
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('User not found');

    const order = new Orders();
    order.date = new Date();
    order.user = user;

    const newOrder = await this.ordersRepository.save(order);

    const productsArray = await Promise.all(
      products.map(async (element) => {
        const product = await this.productsRepository.findOneBy({
          id: element.id,
        });

        if (!product)
          throw new NotFoundException('One or more items were not found');

        if (product.stock <= 0) {
          await this.productsRepository.delete(product);
          return null;
        }
        total += Number(product.price);

        await this.productsRepository.update(
          { id: element.id },
          { stock: product.stock - 1 },
        );

        return product;
      }),
    );

    const orderDetail = new OrderDetails();

    orderDetail.price = Number(Number(total).toFixed(2));
    orderDetail.products = productsArray;
    orderDetail.order = newOrder;

    await this.orderDetailsRepository.save(orderDetail);

    return await this.ordersRepository.find({
      where: { id: newOrder.id },
      relations: { orderDetails: true },
    });
  }
}
