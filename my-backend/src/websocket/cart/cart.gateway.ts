// src/websocket/cart.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class CartGateway {
  @WebSocketServer()
  server: Server;

  // Client join room theo userId
  @SubscribeMessage('joinCart')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
    console.log(`User ${userId} joined cart room`);
  }

  // Gọi hàm này từ cart.service khi có thay đổi
  broadcastCart(userId: string, cartItems: any[]) {
    this.server.to(userId).emit('cartUpdated', cartItems);
  }
}