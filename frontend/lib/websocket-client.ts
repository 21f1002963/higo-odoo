import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    this.socket = io(WS_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Set up message handlers
    this.socket.on('message', (data) => {
      const handlers = this.messageHandlers.get('message');
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    });

    this.socket.on('auction_update', (data) => {
      const handlers = this.messageHandlers.get('auction_update');
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    });

    this.socket.on('chat_message', (data) => {
      const handlers = this.messageHandlers.get('chat_message');
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    });
  }

  public subscribe(event: string, handler: (data: any) => void) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)?.add(handler);
  }

  public unsubscribe(event: string, handler: (data: any) => void) {
    this.messageHandlers.get(event)?.delete(handler);
  }

  public joinAuction(auctionId: string) {
    this.socket?.emit('join_auction', { auctionId });
  }

  public leaveAuction(auctionId: string) {
    this.socket?.emit('leave_auction', { auctionId });
  }

  public joinChat(chatId: string) {
    this.socket?.emit('join_chat', { chatId });
  }

  public leaveChat(chatId: string) {
    this.socket?.emit('leave_chat', { chatId });
  }

  public sendMessage(chatId: string, content: string) {
    this.socket?.emit('chat_message', { chatId, content });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsClient = new WebSocketClient(); 