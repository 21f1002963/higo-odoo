import { apiClient } from '../api-client';

// Placeholder for product actions

interface ProductSearchParams {
  category?: string;
  search?: string;
  // Add other search/filter params as needed from API_DOCUMENTATION.md (2.1. List Products)
  condition?: "new" | "like_new" | "good" | "fair" | "used_acceptable";
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "distance_asc";
  page?: number;
  limit?: number;
  isAuction?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  category?: { id: string; name: string };
  price: number;
  images?: string[];
  condition?: string;
  seller?: {
    id: string;
    username: string;
    profilePictureUrl?: string;
    rating?: number;
    location?: string;
  };
  postedAt?: string;
  updatedAt?: string;
  isAuction?: boolean;
  auctionDetails?: {
    minimumBid?: number;
    reservePrice?: number;
    auctionEndTime?: string;
    currentHighestBid?: number;
    totalBids?: number;
  };
}

export async function getProducts(searchParams: ProductSearchParams): Promise<Product[]> {
  return apiClient.getProducts(searchParams);
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    return await apiClient.getProductById(productId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  return apiClient.createProduct(product);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return apiClient.updateProduct(id, product);
}

export async function deleteProduct(id: string): Promise<void> {
  return apiClient.deleteProduct(id);
}

export async function placeBid(productId: string, amount: number): Promise<{ bidId: string }> {
  return apiClient.placeBid(productId, amount);
}

export async function getBids(productId: string): Promise<{
  bids: Array<{
    bidderId: string;
    bidderUsername: string;
    amount: number;
    timestamp: string;
  }>;
  currentHighestBid: number;
  totalBids: number;
}> {
  return apiClient.getBids(productId);
}

// Add other product-related actions here (create, update, delete) as per API_DOCUMENTATION.md 