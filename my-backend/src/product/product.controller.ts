import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, ValidationPipe, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }
    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get('filter')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    filterProducts(@Query() filterDto: FilterProductDto) {
        console.log('Filter DTO received:', filterDto);
        return this.productService.filterProducts(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }

    // @Post(':id/review')
    // async createReview(
    //     @Param('id') productId: string,
    //     @Body() dto: CreateReviewDto,
    //     @Req() req,
    // ) {

    //     const userId = req.user?.userId ?? null;
    //     const fullname = req.user?.fullname ?? "Khách vãng lai";

    //     return this.productService.createReview(productId, userId, fullname, dto);
    // }


    @Post(':id/review')
    async createReview(
        @Param('id') productId: string,
        @Body() dto: CreateReviewDto
    ) {
        const userId = dto.userId || null; 
        const fullname = dto.fullname || "Khách vãng lai"; // hoặc gửi từ frontend nếu muốn

        return this.productService.createReview(productId, userId, fullname, dto);
    }


    @Get(':id/reviews')
    async getReviews(@Param('id') id: string) {
        return this.productService.getReviews(id);
    }
}
