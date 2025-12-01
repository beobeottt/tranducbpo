import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { CartItem, CartItemSchema } from 'src/cart/schema/cart-item.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Order.name, schema: OrderSchema},
      {name: User.name, schema: UserSchema},
      {name: CartItem.name, schema: CartItemSchema},
    ]),
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
