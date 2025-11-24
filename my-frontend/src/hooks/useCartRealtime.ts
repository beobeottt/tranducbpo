// src/hooks/useCartRealtime.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useCartRealtime = (userId: string, setCartItems: any) => {
  useEffect(() => {
    if (!userId) return;

    // Tạo socket có type rõ ràng
    socket = io('http://localhost:3000');

    // Tham gia room
    socket.emit('joinCart', userId);

    // Lắng nghe cập nhật
    socket.on('cartUpdated', (items: any[]) => {
      setCartItems(items);
    });

    // Cleanup (disconnect socket)
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [userId]);
};
