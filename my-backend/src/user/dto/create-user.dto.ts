import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingAddressDto } from './shipping-address.dto';

export class CreateUserDto {
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingAddressDto)
  shippingAddresses?: ShippingAddressDto[];

  @IsOptional()
  @IsNumber()
  point?: number = 0;

  @IsOptional()
  @IsIn(['Male', 'FeMale'])
  gender?: 'Male' | 'FeMale';
}