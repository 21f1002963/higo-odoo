import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { useWebSocket } from './useWebSocket';
import { Product } from '../lib/actions/product.actions';

interface Bid {
  bidderId: string;
  bidderUsername: string;
  amount: number;
  timestamp: string;
}

interface AuctionDetails {
  minimumBid: number;
  reservePrice?: number;
  auctionEndTime: string;
  currentHighestBid?: number;
  totalBids: number;
  bids: Bid[];
}

export function useAuction(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { subscribe, joinAuction } = useWebSocket();

  const fetchAuctionDetails = useCallback(async () => {
    try {
      setLoading(true);
      const productData = await apiClient.getProductById(productId);
      setProduct(productData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch auction details'));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const placeBid = useCallback(async (amount: number) => {
    if (!product?.isAuction) {
      throw new Error('This product is not an auction item');
    }

    try {
      setLoading(true);
      await apiClient.placeBid(productId, amount);
      await fetchAuctionDetails(); // Refresh auction details after placing bid
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to place bid'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product, productId, fetchAuctionDetails]);

  // Subscribe to real-time auction updates
  useEffect(() => {
    if (!product?.isAuction) return;

    const cleanup = joinAuction(productId);

    const handleAuctionUpdate = (data: any) => {
      if (data.productId === productId) {
        setProduct(prev => prev ? {
          ...prev,
          auctionDetails: {
            ...prev.auctionDetails!,
            currentHighestBid: data.currentHighestBid,
            totalBids: data.totalBids,
            bids: data.bids,
          }
        } : null);
      }
    };

    const unsubscribe = subscribe('auction_update', handleAuctionUpdate);

    return () => {
      cleanup();
      unsubscribe();
    };
  }, [product?.isAuction, productId, joinAuction, subscribe]);

  // Fetch initial auction details
  useEffect(() => {
    fetchAuctionDetails();
  }, [fetchAuctionDetails]);

  const isAuctionEnded = product?.auctionDetails?.auctionEndTime
    ? new Date(product.auctionDetails.auctionEndTime) < new Date()
    : false;

  const timeRemaining = product?.auctionDetails?.auctionEndTime
    ? new Date(product.auctionDetails.auctionEndTime).getTime() - new Date().getTime()
    : 0;

  return {
    product,
    loading,
    error,
    placeBid,
    isAuctionEnded,
    timeRemaining,
    refreshAuction: fetchAuctionDetails,
  };
} 