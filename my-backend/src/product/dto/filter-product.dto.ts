import { IsString, IsNumber, IsOptional, IsEnum, Min, ValidateIf, Validate } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterProductDto {
  // Tùy chọn: Thương hiệu
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  brand?: string;

  // Tùy chọn: Giá min
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  @IsNumber()
  @Min(0)
  priceMin?: number;

  // Tùy chọn: Giá max
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  @IsNumber()
  @Min(0)
  priceMax?: number;

  // Tùy chọn: Loại sản phẩm
  @IsOptional()
  @IsEnum(['New Product', 'Best Seller'])
  typeProduct?: 'New Product' | 'Best Seller';

  // Tùy chọn: Số lượng tối thiểu
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  // Tùy chọn: Tìm kiếm theo tên
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  search?: string;

  // Tùy chọn: Sắp xếp
  @IsOptional()
  @IsEnum(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest'])
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

  // Tùy chọn: Phân trang
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? 1 : Number(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? 10 : Number(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
