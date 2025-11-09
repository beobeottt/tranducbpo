import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schema/discount.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Discount.name, schema: DiscountSchema}])],
  providers: [DiscountService],
  controllers: [DiscountController],
  exports: [DiscountService]
})
export class DiscountModule {}
