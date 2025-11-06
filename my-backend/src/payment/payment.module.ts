import { Module } from '@nestjs/common';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from 'src/cart/schema/cart-item.schema';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}