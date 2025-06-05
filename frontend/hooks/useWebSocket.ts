import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

type WebSocketMessage = {
  type: string;
  payload: any;
};

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      // Send authentication message if user is logged in
      if (user) {
        ws.send(JSON.stringify({
          type: 'auth',
          payload: { token: localStorage.getItem('token') }
        }));
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (event) => {
      setError(new Error('WebSocket connection error'));
    };

    return () => {
      ws.close();
    };
  }, [user]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      setError(new Error('WebSocket is not connected'));
    }
  }, []);

  const subscribe = useCallback((type: string, callback: (payload: any) => void) => {
    if (!wsRef.current) return;

    const messageHandler = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        if (message.type === type) {
          callback(message.payload);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    wsRef.current.addEventListener('message', messageHandler);
    return () => {
      wsRef.current?.removeEventListener('message', messageHandler);
    };
  }, []);

  // Connect when user is authenticated
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [user, connect, disconnect]);

  return {
    isConnected,
    error,
    sendMessage,
    subscribe,
    connect,
    disconnect,
  };
} 