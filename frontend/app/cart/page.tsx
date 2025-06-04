"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart } from 'lucide-react';

// Mock cart item structure - replace with API data
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

const mockCartItems: CartItem[] = [
  { id: 'ci1', productId: 'p1', name: 'Vintage Leather Jacket', price: 120, quantity: 1, image: 'https://via.placeholder.com/100x100.png?text=Jacket' },
  { id: 'ci2', productId: 'p3', name: 'Retro Gaming Console', price: 200, quantity: 1, image: 'https://via.placeholder.com/100x100.png?text=Console' },
];

export default function CartPage() {
  // In a real app, fetch cart items from API: GET /api/cart
  const [cartItems, setCartItems] = React.useState<CartItem[]>(mockCartItems);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
    // TODO: API call to PUT /api/cart/items/{itemId} with new quantity
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // TODO: API call to DELETE /api/cart/items/{itemId}
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedShipping = cartItems.length > 0 ? 10 : 0; // Simplified shipping
  const total = subtotal + estimatedShipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map(item => (
            <Card key={item.id} className="flex items-center p-4 gap-4">
              <img 
                src={item.image || 'https://via.placeholder.com/100x100.png?text=Item'} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-grow">
                <Link href={`/products/${item.productId}`} className="hover:underline">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                </Link>
                <p className="text-sm text-muted-foreground">{item.category || 'N/A'}</p>
                <p className="text-lg font-medium text-primary mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  min="1"
                  className="w-16 text-center"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>${estimatedShipping.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4" size="lg">
                Proceed to Checkout
              </Button>
              {/* TODO: Link to actual checkout page or integrate payment */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
