import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dtos/orders.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Orders } from 'src/entities/orders.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly OrdersService: OrdersService) {}

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard)
  getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<Orders> {
    return this.OrdersService.getOrder(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  addOrder(@Body() order: CreateOrderDto): Promise<Orders[]> {
    const { userId, products } = order;
    return this.OrdersService.addOrder(userId, products);
  }
}
