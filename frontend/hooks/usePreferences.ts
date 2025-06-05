import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

type Language = 'en' | 'hi' | 'gu';

interface Preferences {
  language: Language;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const DEFAULT_PREFERENCES: Preferences = {
  language: 'en',
  theme: 'system',
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
};

export function usePreferences() {
  const { profile, updateProfile } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Load preferences from user profile
  useEffect(() => {
    if (profile) {
      setPreferences({
        language: profile.preferredLanguage,
        theme: 'system', // Could be stored in profile if needed
        notifications: profile.communicationPreferences,
      });
    }
    setLoading(false);
  }, [profile]);

  const updateLanguage = useCallback(async (language: Language) => {
    try {
      setLoading(true);
      await updateProfile({ preferredLanguage: language });
      setPreferences(prev => ({ ...prev, language }));
    } finally {
      setLoading(false);
    }
  }, [updateProfile]);

  const updateTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({ ...prev, theme }));
    // Could persist theme preference to localStorage or profile
    localStorage.setItem('theme', theme);
  }, []);

  const updateNotifications = useCallback(async (notifications: Preferences['notifications']) => {
    try {
      setLoading(true);
      await updateProfile({
        communicationPreferences: notifications,
      });
      setPreferences(prev => ({ ...prev, notifications }));
    } finally {
      setLoading(false);
    }
  }, [updateProfile]);

  // Apply theme on mount and when it changes
  useEffect(() => {
    const theme = preferences.theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : preferences.theme;

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [preferences.theme]);

  return {
    preferences,
    loading,
    updateLanguage,
    updateTheme,
    updateNotifications,
  };
} 