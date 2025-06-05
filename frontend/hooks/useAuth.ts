import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { useClerk } from '@clerk/nextjs';

interface UserProfile {
  id: string;
  clerkUserId: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
  location: string;
  aboutMe: string;
  communicationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  preferredLanguage: 'en' | 'hi' | 'gu';
  sellerRating: number;
  joinedAt: string;
}

export function useAuth() {
  const { user, isLoaded: isClerkLoaded } = useClerk();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userProfile = await apiClient.getUserProfile();
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      const updatedProfile = await apiClient.updateUserProfile(updates);
      setProfile(updatedProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user profile'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch profile when user state changes
  useEffect(() => {
    if (isClerkLoaded) {
      fetchProfile();
    }
  }, [isClerkLoaded, fetchProfile]);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    updateProfile,
    refreshProfile: fetchProfile,
  };
} 