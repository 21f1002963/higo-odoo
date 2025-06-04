"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Landmark, MessageSquare, ShoppingCart, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/actions/product.actions'; // Import Product type

// Removed local Product interface definition

interface ProductInteractionControlsProps {
  product: Product; // Use imported Product type
}

// Helper to format date (copied from product detail page)
const formatDate = (isoString: string | undefined) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export default function ProductInteractionControls({ product }: ProductInteractionControlsProps) {
  const { appUser } = useAuth(); // Get user from your AuthContext
  const isSignedIn = !!appUser;

  // Placeholder for assuming current user is the seller (replace with actual logic)
  // This would typically involve comparing appUser.id with product.seller.id
  const isOwner = isSignedIn && appUser?.id === product.seller?.id; // Assuming product.seller.id exists

  return (
    <>
      {product.isAuction && product.auctionDetails && (
        <div className="p-4 border rounded-lg bg-secondary/50 space-y-3">
          <h3 className="text-xl font-semibold flex items-center"><Landmark className="w-5 h-5 mr-2"/>Auction Details</h3>
          {product.auctionDetails.currentHighestBid && (
            <p className="text-lg">Current Bid: <span className="font-bold text-green-600">${product.auctionDetails.currentHighestBid.toFixed(2)}</span> ({product.auctionDetails.totalBids || 0} bids)</p>
          )}
          <p>Minimum Bid: ${product.auctionDetails.minimumBid?.toFixed(2) || 'N/A'}</p>
          <div className="flex items-center text-destructive">
            <Clock className="w-5 h-5 mr-2" />
            <span>Ends: {formatDate(product.auctionDetails.auctionEndTime)}</span>
          </div>
          {isSignedIn ? (
            <div className="flex gap-2 pt-2">
                <Input type="number" placeholder={`Enter bid (>$${product.auctionDetails.currentHighestBid || product.auctionDetails.minimumBid || '0'})`} className="flex-grow" />
                <Button className="bg-green-600 hover:bg-green-700 text-white">Place Bid</Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Please <Link href={`/login?redirect_url=/products/${product.id}`} className="text-primary hover:underline">sign in</Link> to place a bid.</p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {isSignedIn ? (
          <>
            {!product.isAuction && (
                <Button size="lg" className="w-full sm:w-auto flex-grow">
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
            )}
            <Button size="lg" variant="outline" className="w-full sm:w-auto flex-grow">
              <MessageSquare className="w-5 h-5 mr-2" /> Chat with Seller
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" className="w-full sm:w-auto flex-grow" asChild>
                <Link href={`/login?redirect_url=/products/${product.id}`}><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto flex-grow" asChild>
                 <Link href={`/login?redirect_url=/products/${product.id}`}><MessageSquare className="w-5 h-5 mr-2" /> Chat with Seller</Link>
            </Button>
          </>
        )}
      </div>

      {isOwner && ( // Show only if user is signed in and is the owner
        <div className="mt-6 pt-6 border-t flex items-center gap-2">
            <p className="text-xs text-muted-foreground mr-auto">Manage your listing:</p>
            <Button variant="outline" size="sm"><Edit3 className="w-4 h-4 mr-1.5" /> Edit</Button>
            <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-1.5"/> Delete</Button>
        </div>
      )}
    </>
  );
} 