// src/order/dto/update-order.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'])
  @IsOptional()
  status?: string;
}
