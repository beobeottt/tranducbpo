import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from './schema/cart-item.schema';
import { CartGateway } from 'src/websocket/cart/cart.gateway';

@Module({
  imports: [MongooseModule.forFeature([{name: CartItem.name, schema: CartItemSchema}])],
  providers: [CartService, CartGateway],
  controllers: [CartController]
})
export class CartModule {}
