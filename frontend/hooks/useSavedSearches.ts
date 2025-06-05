import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { ProductSearchParams } from '../lib/actions/product.actions';

interface SavedSearch {
  id: string;
  name: string;
  queryParameters: ProductSearchParams;
  createdAt: string;
  lastNotifiedAt?: string;
  isActive: boolean;
}

interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  lastNotifiedAt?: string;
  isActive: boolean;
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSavedSearches = useCallback(async () => {
    try {
      setLoading(true);
      const searches = await apiClient.getSavedSearches();
      setSavedSearches(searches);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch saved searches'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPriceAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const alerts = await apiClient.getPriceAlerts();
      setPriceAlerts(alerts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch price alerts'));
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSearch = useCallback(async (name: string, queryParameters: ProductSearchParams) => {
    try {
      setLoading(true);
      const newSearch = await apiClient.saveSearch({ name, queryParameters });
      setSavedSearches(prev => [...prev, newSearch]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save search'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSavedSearch = useCallback(async (searchId: string) => {
    try {
      setLoading(true);
      await apiClient.deleteSavedSearch(searchId);
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete saved search'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPriceAlert = useCallback(async (productId: string, targetPrice: number) => {
    try {
      setLoading(true);
      const newAlert = await apiClient.createPriceAlert(productId, targetPrice);
      setPriceAlerts(prev => [...prev, newAlert]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create price alert'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePriceAlert = useCallback(async (alertId: string) => {
    try {
      setLoading(true);
      await apiClient.deletePriceAlert(alertId);
      setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete price alert'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchSavedSearches();
    fetchPriceAlerts();
  }, [fetchSavedSearches, fetchPriceAlerts]);

  return {
    savedSearches,
    priceAlerts,
    loading,
    error,
    saveSearch,
    deleteSavedSearch,
    createPriceAlert,
    deletePriceAlert,
    refreshSavedSearches: fetchSavedSearches,
    refreshPriceAlerts: fetchPriceAlerts,
  };
} 