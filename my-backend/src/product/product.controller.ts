import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
  UsePipes,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `product-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
                }
                cb(null, true);
            },
        }),
    )
    create(
        @Body() dto: CreateProductDto,
        @UploadedFile() file?: any,
    ) {
        const parsedDto: any = { ...dto };
        if (typeof parsedDto.variants === 'string') {
          try {
            parsedDto.variants = JSON.parse(parsedDto.variants);
          } catch {
            parsedDto.variants = [];
          }
        }

        if (file) {
            parsedDto.img = `/uploads/products/${file.filename}`;
        }
        return this.productService.create(parsedDto);
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
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `product-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
                }
                cb(null, true);
            },
        }),
    )
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
        @UploadedFile() file?: any,
    ) {
        const parsedDto: any = { ...dto };
        if (typeof parsedDto.variants === 'string') {
          try {
            parsedDto.variants = JSON.parse(parsedDto.variants);
          } catch {
            parsedDto.variants = [];
          }
        }
        if (file) {
            parsedDto.img = `/uploads/products/${file.filename}`;
        }
        return this.productService.update(id, parsedDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }

    @Post(':id/review')
    async createReview(
        @Param('id') productId: string,
        @Body() dto: CreateReviewDto
    ) {
        const userId = dto.userId || null; 
        const fullname = dto.fullname || "Khách vãng lai";

        return this.productService.createReview(productId, userId, fullname, dto);
    }


    @Get(':id/reviews')
    async getReviews(@Param('id') id: string) {
        return this.productService.getReviews(id);
    }
}
