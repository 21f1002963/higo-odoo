import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { Product } from '../lib/actions/product.actions';

interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const cart = await apiClient.getCart();
      setItems(cart.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cart'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);
      await apiClient.addToCart(product.id, quantity);
      await fetchCart(); // Refresh cart after adding item
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add item to cart'));
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      await apiClient.removeFromCart(productId);
      await fetchCart(); // Refresh cart after removing item
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove item from cart'));
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      await apiClient.addToCart(productId, quantity); // Reuse addToCart endpoint
      await fetchCart(); // Refresh cart after updating quantity
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update item quantity'));
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      // Remove all items one by one
      await Promise.all(items.map(item => apiClient.removeFromCart(item.product.id)));
      await fetchCart(); // Refresh cart after clearing
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear cart'));
    } finally {
      setLoading(false);
    }
  }, [items, fetchCart]);

  // Calculate cart totals
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    items,
    loading,
    error,
    subtotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: fetchCart,
  };
} 