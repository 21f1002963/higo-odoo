import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { usePreferences } from '../hooks/usePreferences';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { useDisputes } from '../hooks/useDisputes';
import { useWebSocket } from '../hooks/useWebSocket';
import { useReviews } from '../hooks/useReviews';
import { useNotifications } from '../hooks/useNotifications';
import { useLanguage } from '../hooks/useLanguage';

interface AppContextType {
  auth: ReturnType<typeof useAuth>;
  cart: ReturnType<typeof useCart>;
  preferences: ReturnType<typeof usePreferences>;
  savedSearches: ReturnType<typeof useSavedSearches>;
  disputes: ReturnType<typeof useDisputes>;
  ws: ReturnType<typeof useWebSocket>;
  reviews: ReturnType<typeof useReviews>;
  notifications: ReturnType<typeof useNotifications>;
  language: ReturnType<typeof useLanguage>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const cart = useCart();
  const preferences = usePreferences();
  const savedSearches = useSavedSearches();
  const disputes = useDisputes();
  const ws = useWebSocket();
  const reviews = useReviews(''); // Initialize with empty productId, will be set when needed
  const notifications = useNotifications();
  const language = useLanguage();

  const value = {
    auth,
    cart,
    preferences,
    savedSearches,
    disputes,
    ws,
    reviews,
    notifications,
    language,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 