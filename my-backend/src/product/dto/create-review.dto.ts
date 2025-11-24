import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsOptional()
    @IsString()
    userId?: string | null;

    @IsOptional()
    @IsString()
    fullname?: string | null;


    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    comment: string;
}
