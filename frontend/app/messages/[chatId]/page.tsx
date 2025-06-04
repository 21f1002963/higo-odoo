"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // To get chatId from URL
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, Image as ImageIcon, ShoppingBag } from 'lucide-react'; // Added Paperclip and ImageIcon
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// Mock message structure - replace with API data from GET /api/chats/{chatId}/messages
interface Message {
  id: string;
  chatId: string;
  senderId: string; // 'currentUser' or other participant's ID
  senderUsername: string;
  senderAvatarUrl?: string;
  text: string;
  timestamp: string; // ISO timestamp
  isRead?: boolean;
  attachment?: {
    type: 'image' | 'product_link';
    url?: string; // for image
    productId?: string; // for product link
    productTitle?: string;
    productImageUrl?: string;
  };
}

// Mock data for a specific chat
const mockChatDetails = {
  conv1: {
    participants: [
      { userId: 'currentUser', username: 'Me', avatarUrl: 'https://via.placeholder.com/40x40.png?text=Me' },
      { userId: 'user2', username: 'SellerJane', avatarUrl: 'https://via.placeholder.com/40x40.png?text=SJ' },
    ],
    relatedProduct: { id: 'p1', title: 'Vintage Leather Jacket', imageUrl: 'https://via.placeholder.com/150x150.png?text=Jacket' },
    messages: [
      { id: 'm1', chatId: 'conv1', senderId: 'user2', senderUsername: 'SellerJane', text: 'Hi there! Thanks for your interest in the Vintage Leather Jacket.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 5*60000).toISOString() },
      { id: 'm2', chatId: 'conv1', senderId: 'currentUser', senderUsername: 'Me', text: 'Is the vintage jacket still available? And what\'s its condition?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 'm3', chatId: 'conv1', senderId: 'user2', senderUsername: 'SellerJane', text: 'Yes, it is! It\'s in excellent condition, like new.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5*60000).toISOString() },
      { id: 'm4', chatId: 'conv1', senderId: 'currentUser', senderUsername: 'Me', text: 'Sounds good. Can I see another picture of the collar?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: 'm5', chatId: 'conv1', senderId: 'user2', senderUsername: 'SellerJane', text: 'Sure, here you go.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5*60000).toISOString(), attachment: { type: 'image', url: 'https://via.placeholder.com/300x200.png?text=Collar+Pic' } },
    ]
  },
  conv2: {
    participants: [ /* ... */ ], messages: [ /* ... */ ]
  }
  // Add other conv details as needed
};

const formatDate = (isoString: string) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatPartner, setChatPartner] = useState<any>(null); // Store the other participant's details
  const [relatedProductInfo, setRelatedProductInfo] = useState<any>(null);

  useEffect(() => {
    if (chatId) {
      setIsLoading(true);
      // Simulate API call to GET /api/chats/{chatId}/messages
      setTimeout(() => {
        const chatData = (mockChatDetails as any)[chatId];
        if (chatData) {
          setMessages(chatData.messages);
          const partner = chatData.participants.find((p:any) => p.userId !== 'currentUser');
          setChatPartner(partner);
          setRelatedProductInfo(chatData.relatedProduct);
        } else {
          // Handle chat not found
          setMessages([]);
          setChatPartner(null);
        }
        setIsLoading(false);
      }, 500);
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageToSend: Message = {
      id: `msg${Date.now()}`,
      chatId: chatId,
      senderId: 'currentUser', // Assume current user is sending
      senderUsername: 'Me', // Replace with actual current user username
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage('');
    // TODO: API call to POST /api/chats/{chatId}/messages with { text: newMessage }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 h-screen flex items-center justify-center">Loading chat...</div>;
  }

  if (!chatPartner) {
     return (
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Chat Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">Sorry, this chat doesn't exist or you don't have access.</p>
            <Button asChild>
              <Link href="/messages"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-8 h-[calc(100vh-var(--navbar-height,4rem))] sm:h-auto sm:max-h-[calc(100vh-var(--navbar-height,4rem)-2rem)] flex flex-col bg-card border-x sm:rounded-lg">
      {/* Chat Header */}
      <header className="flex items-center p-3 sm:p-4 border-b sticky top-0 bg-card z-10">
        <Link href="/messages">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Avatar className="w-10 h-10 border mr-3">
          <AvatarImage src={chatPartner?.avatarUrl} alt={chatPartner?.username} />
          <AvatarFallback>{chatPartner?.username.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="font-semibold text-lg">{chatPartner?.username || 'Chat'}</h2>
            {relatedProductInfo && (
                <Link href={`/products/${relatedProductInfo.id}`} className="text-xs text-muted-foreground hover:underline flex items-center">
                   <ShoppingBag className="w-3 h-3 mr-1" /> Regarding: {relatedProductInfo.title}
                </Link>
            )}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-4 bg-background sm:bg-card">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.senderId === 'currentUser' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.attachment?.type === 'image' && msg.attachment.url && (
                <img src={msg.attachment.url} alt="Attachment" className="mt-2 rounded-md max-w-full h-auto" />
              )}
               {msg.attachment?.type === 'product_link' && msg.attachment.productId && (
                <Link href={`/products/${msg.attachment.productId}`} className="mt-2 p-2 border rounded-md flex items-center gap-2 hover:bg-background/50 transition-colors bg-background">
                    <img src={msg.attachment.productImageUrl || 'https://via.placeholder.com/40x40.png?text=Item'} alt="Product image" className="w-10 h-10 rounded-sm object-cover"/>
                    <div>
                        <p className="text-xs font-semibold">{msg.attachment.productTitle || "View Product"}</p>
                        <p className="text-xs text-muted-foreground">Click to view product</p>
                    </div>
                </Link>
              )}
              <p className={`text-xs mt-1 ${msg.senderId === 'currentUser' ? 'text-primary-foreground/70' : 'text-muted-foreground/80'} text-right`}>
                {formatDate(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSendMessage} className="border-t p-3 sm:p-4 flex items-center gap-2 sticky bottom-0 bg-card z-10">
        <Button variant="ghost" size="icon" type="button"><Paperclip className="w-5 h-5 text-muted-foreground"/></Button> {/* Placeholder for attachments */}
        <Input 
          type="text" 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow"
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
} 