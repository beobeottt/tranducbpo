// src/order/dto/create-order.dto.ts
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

class OrderShippingAddressDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  addressLine: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  totalPrice: number;

  @IsNumber()
  @IsOptional()
  pointsToRedeem?: number;

  @IsOptional()
  @IsString()
  shippingAddressId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderShippingAddressDto)
  shippingAddress?: OrderShippingAddressDto;
}
