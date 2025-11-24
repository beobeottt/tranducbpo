import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { Review, ReviewSchema } from './schema/review.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Product.name, schema: ProductSchema},
    {name: Review.name, schema: ReviewSchema}
  ])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
