import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: ['http://localhost:3001', 'http://localhost:5173'], // React port của bạn
        credentials: true,
      },
    });
    return server;
  }
}