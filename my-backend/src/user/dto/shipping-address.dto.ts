import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class ShippingAddressDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsString()
  fullName: string;

  @IsString()
  @Length(6, 15)
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

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateShippingAddressDto extends PartialType(ShippingAddressDto) {}



