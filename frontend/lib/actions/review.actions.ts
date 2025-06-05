import { apiClient } from '../api-client';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface CreateReviewData {
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating: number;
  comment: string;
}

export const reviewActions = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    return apiClient.getProductReviews(productId);
  },

  createReview: async (productId: string, data: CreateReviewData): Promise<Review> => {
    return apiClient.createProductReview(productId, data);
  },

  updateReview: async (reviewId: string, data: UpdateReviewData): Promise<Review> => {
    return apiClient.updateProductReview(reviewId, data);
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    return apiClient.deleteProductReview(reviewId);
  },
}; 