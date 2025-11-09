import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, IsEnum, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
export class CreateDiscountDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['percentage', 'fixed'])
  discountType: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @IsNumber()
  maxUsage?: number;

  @IsOptional()
  @IsNumber()
  minOrderValue?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  applicableProducts?: string[];

  @IsOptional()
  @IsArray()
  applicableUsers?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


export class UpdateDiscountDto extends PartialType(CreateDiscountDto){}