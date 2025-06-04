"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquarePlus, Search, Archive } from 'lucide-react';
import { Input } from "@/components/ui/input";

// Mock conversation structure - replace with API data from GET /api/chats
interface Participant {
  userId: string;
  username: string;
  avatarUrl?: string;
}

interface LastMessage {
  text: string;
  timestamp: string; // ISO timestamp
  senderId: string;
}

interface Conversation {
  id: string;
  participants: Participant[]; // Usually 2, one of them being the current user
  lastMessage: LastMessage;
  unreadCount: number;
  relatedProduct?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [
      { userId: 'currentUser', username: 'Me', avatarUrl: 'https://via.placeholder.com/40x40.png?text=Me' },
      { userId: 'user2', username: 'SellerJane', avatarUrl: 'https://via.placeholder.com/40x40.png?text=SJ' },
    ],
    lastMessage: { text: 'Is the vintage jacket still available?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), senderId: 'currentUser' },
    unreadCount: 0,
    relatedProduct: { id: 'p1', title: 'Vintage Leather Jacket', imageUrl: 'https://via.placeholder.com/60x60.png?text=Jacket' },
  },
  {
    id: 'conv2',
    participants: [
      { userId: 'currentUser', username: 'Me' },
      { userId: 'user3', username: 'BuyerBob', avatarUrl: 'https://via.placeholder.com/40x40.png?text=BB' },
    ],
    lastMessage: { text: 'Great! I\'ll take it. When can we meet?', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), senderId: 'user3' },
    unreadCount: 2,
    relatedProduct: { id: 'p3', title: 'Retro Gaming Console', imageUrl: 'https://via.placeholder.com/60x60.png?text=Console' },
  },
  {
    id: 'conv3',
    participants: [
      { userId: 'currentUser', username: 'Me' },
      { userId: 'user4', username: 'AdminSupport', avatarUrl: 'https://via.placeholder.com/40x40.png?text=AS' },
    ],
    lastMessage: { text: 'Your dispute #D123 has been updated.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), senderId: 'user4' },
    unreadCount: 1,
  },
];

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) return `${Math.ceil(diffTime / (1000*60))}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString(undefined, { weekday: 'short' });
    return date.toLocaleDateString();
};

export default function MessagesPage() {
  // In a real app, fetch conversations from API: GET /api/chats
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 700);
  }, []);

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.userId !== 'currentUser');
    return (
        otherParticipant?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.relatedProduct?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading conversations...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquarePlus className="w-4 h-4 mr-2" /> Start New Chat
          </Button>
           {/* Placeholder for initiating a new chat - POST /api/chats/initiate */}
        </div>
      </div>

       <div className="mb-6">
          <Input 
            type="search" 
            placeholder="Search messages or contacts..." 
            className="w-full max-w-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      {filteredConversations.length === 0 && !isLoading ? (
         <div className="text-center py-12 text-muted-foreground">
           <Archive className="w-20 h-20 mx-auto mb-4" />
           <p className="text-lg">No conversations found.</p>
           {searchTerm && <p>Try adjusting your search.</p>}
         </div>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map(conv => {
            const otherParticipant = conv.participants.find(p => p.userId !== 'currentUser');
            return (
              <Link key={conv.id} href={`/messages/${conv.id}`} className="block hover:bg-muted/50 rounded-lg transition-colors">
                <Card className="cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-4">
                    <Avatar className="w-12 h-12 border">
                      <AvatarImage src={otherParticipant?.avatarUrl} alt={otherParticipant?.username} />
                      <AvatarFallback>{otherParticipant?.username.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-semibold ${conv.unreadCount > 0 ? 'text-primary' : ''}`}>{otherParticipant?.username || 'Unknown User'}</h3>
                        <span className={`text-xs ${conv.unreadCount > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{formatDate(conv.lastMessage.timestamp)}</span>
                      </div>
                      {conv.relatedProduct && (
                        <p className="text-xs text-muted-foreground truncate">Re: {conv.relatedProduct.title}</p>
                      )}
                      <p className={`text-sm ${conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'} truncate`}>
                        {conv.lastMessage.senderId === 'currentUser' && 'You: '}{conv.lastMessage.text}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto self-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      {/* TODO: Pagination if many conversations */}
    </div>
  );
} 