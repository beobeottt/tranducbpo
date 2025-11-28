import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVNPayPaymentDto {
  @IsNumber()
  @Min(1_000)
  amount: number;

  @IsOptional()
  @IsString()
  orderDescription?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  locale?: string;
}


