import { Module } from '@nestjs/common';
import { CartGateway } from './cart/cart.gateway';

@Module({
  providers: [CartGateway]
})
export class WebsocketModule {}
