import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCartItemDto {
    
    @IsString()
    @IsOptional()
    userId: string;

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsOptional()
    shopName: string;

    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    url: string; 
}

export class UpdateCartItemDto {
    
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsOptional()
    shopName: string;

    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    url: string; // this is link to image of product
}

export class AddToCartDto {
  @IsMongoId({ message: 'ID sản phẩm không hợp lệ' })
  productId: string;

  @IsOptional()
  @IsPositive()
  quantity?: number = 1;
}