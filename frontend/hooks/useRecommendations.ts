import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { Product } from '../lib/actions/product.actions';

type RecommendationContext = 'homepage' | 'product_detail' | 'cart';

export function useRecommendations(context: RecommendationContext, productId?: string) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const recommendedProducts = await apiClient.getRecommendations(context, productId);
      setRecommendations(recommendedProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
    } finally {
      setLoading(false);
    }
  }, [context, productId]);

  // Fetch recommendations when context or productId changes
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: fetchRecommendations,
  };
} 