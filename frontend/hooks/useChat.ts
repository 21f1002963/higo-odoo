import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { useWebSocket } from './useWebSocket';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  participants: Array<{
    id: string;
    username: string;
    profilePictureUrl?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
}

export function useChat(chatId: string) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { subscribe, joinChat, sendMessage: wsSendMessage } = useWebSocket();

  const fetchChat = useCallback(async () => {
    try {
      setLoading(true);
      const chats = await apiClient.getChats();
      const currentChat = chats.find(c => c.id === chatId);
      if (currentChat) {
        setChat(currentChat);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chat'));
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const chatMessages = await apiClient.getChatMessages(chatId);
      setMessages(chatMessages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chat) {
      throw new Error('Chat not found');
    }

    try {
      setLoading(true);
      await apiClient.sendMessage(chatId, content);
      wsSendMessage(chatId, content);
      await fetchMessages(); // Refresh messages after sending
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [chat, chatId, fetchMessages, wsSendMessage]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chat) return;

    const cleanup = joinChat(chatId);

    const handleNewMessage = (data: any) => {
      if (data.chatId === chatId) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    const unsubscribe = subscribe('chat_message', handleNewMessage);

    return () => {
      cleanup();
      unsubscribe();
    };
  }, [chat, chatId, joinChat, subscribe]);

  // Fetch initial chat and messages
  useEffect(() => {
    fetchChat();
    fetchMessages();
  }, [fetchChat, fetchMessages]);

  return {
    chat,
    messages,
    loading,
    error,
    sendMessage,
    refreshChat: fetchChat,
    refreshMessages: fetchMessages,
  };
} 