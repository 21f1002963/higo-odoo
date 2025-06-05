import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { useAuth } from './useAuth';

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

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProductReviews(productId);
      setReviews(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const addReview = useCallback(async (rating: number, comment: string) => {
    if (!user) {
      throw new Error('You must be logged in to add a review');
    }

    try {
      const newReview = await apiClient.createProductReview(productId, {
        rating,
        comment,
      });
      setReviews(prev => [...prev, newReview]);
      return newReview;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add review');
    }
  }, [productId, user]);

  const updateReview = useCallback(async (reviewId: string, rating: number, comment: string) => {
    try {
      const updatedReview = await apiClient.updateProductReview(reviewId, {
        rating,
        comment,
      });
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
      return updatedReview;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update review');
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await apiClient.deleteProductReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete review');
    }
  }, []);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    averageRating,
    ratingDistribution,
    addReview,
    updateReview,
    deleteReview,
    refreshReviews: fetchReviews,
  };
} 