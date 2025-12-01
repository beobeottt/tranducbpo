import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductVariantDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  label: string;

  @IsNumber()
  price: number;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  brand: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsIn(['New Product', 'Best Seller'])
  typeProduct?: 'New Product' | 'Best Seller';

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];
}
