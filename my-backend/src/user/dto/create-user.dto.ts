import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    fullname: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    shippingAddress: string;


    @IsOptional()
    @IsNumber()
    point?: number = 0;

    @IsOptional()
    @IsIn(['Male', 'FeMale'])
    gender?: 'Male' | 'FeMale';
}