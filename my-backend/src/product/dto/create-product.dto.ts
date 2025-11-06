import { IsString, IsNumber, IsInt, IsOptional, IsIn } from 'class-validator';

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
}
