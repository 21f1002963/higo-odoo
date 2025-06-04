"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListOrdered, PackageOpen, MessageCircle } from 'lucide-react';

// Mock order structure - replace with API data from GET /api/orders/history
interface OrderItemSnapshot {
  productId: string; // To link to the product if it still exists
  title: string;
  price: number;
  image?: string;
  quantity: number; 
}

interface Order {
  orderId: string;
  items: OrderItemSnapshot[];
  totalAmount: number;
  orderDate: string; // ISO timestamp
  status: "completed" | "shipped" | "pending_payment" | "cancelled";
  // sellerInfo might be an array if items are from different sellers, or a single object if from one
  // For simplicity, let's assume each item might have its own seller info if needed, or a general seller for the order.
  // The API doc suggests: "sellerInfo": { /* seller id, name for each item if multiple sellers */ }
  // This structure needs clarification or simplification for the mock.
  // Let's assume for mock, each item has a sellerName for now.
}

const mockOrders: Order[] = [
  {
    orderId: 'ord123',
    items: [
      { productId: 'p1', title: 'Vintage Leather Jacket', price: 120, quantity: 1, image: 'https://via.placeholder.com/80x80.png?text=Jacket' },
    ],
    totalAmount: 120,
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
  },
  {
    orderId: 'ord456',
    items: [
      { productId: 'p3', title: 'Retro Gaming Console', price: 200, quantity: 1, image: 'https://via.placeholder.com/80x80.png?text=Console' },
      { productId: 'p4', title: 'Handmade Ceramic Vase', price: 45, quantity: 2, image: 'https://via.placeholder.com/80x80.png?text=Vase' },
    ],
    totalAmount: 290,
    orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    status: 'shipped',
  },
];

const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString();

export default function OrderHistoryPage() {
  // In a real app, fetch orders from API: GET /api/orders/history
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <PackageOpen className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-semibold mb-4">No Order History</h1>
        <p className="text-muted-foreground mb-6">You haven't made any purchases yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ListOrdered className="w-8 h-8 mr-3 text-primary" /> Your Order History
      </h1>
      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.orderId}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <CardTitle className="mb-2 sm:mb-0">Order #{order.orderId.slice(-6)}</CardTitle>
                <Badge variant={order.status === 'completed' ? 'default' : order.status === 'shipped' ? 'secondary' : 'outline'}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>
                Date: {formatDate(order.orderDate)} | Total: ${order.totalAmount.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-3 text-md">Items:</h4>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start sm:items-center gap-4 p-3 border rounded-md bg-muted/50">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80x80.png?text=Item'} 
                      alt={item.title} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border"
                    />
                    <div className="flex-grow">
                      <Link href={`/products/${item.productId}`} className="hover:underline font-medium">
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm text-foreground">Price: ${item.price.toFixed(2)}</p>
                    </div>
                    {order.status === 'completed' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${item.productId}/review`}> {/* Assuming review page per product */}
                          <MessageCircle className="w-4 h-4 mr-1.5" /> Leave Review
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            {/* <CardFooter className="flex justify-end">
              <Button variant="outline" asChild>
                <Link href={`/orders/${order.orderId}`}>View Details</Link>
              </Button>
            </CardFooter> */}
          </Card>
        ))}
      </div>
      {/* TODO: Add pagination if many orders */}
    </div>
  );
} 