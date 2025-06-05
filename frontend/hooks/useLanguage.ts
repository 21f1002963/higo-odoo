import { useState, useCallback, useEffect } from 'react';
import { usePreferences } from './usePreferences';

export type Language = 'en' | 'hi' | 'gu';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

// Common translations
const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    gu: 'હોમ',
  },
  'nav.search': {
    en: 'Search',
    hi: 'खोज',
    gu: 'શોધો',
  },
  'nav.cart': {
    en: 'Cart',
    hi: 'कार्ट',
    gu: 'કાર્ટ',
  },
  'nav.profile': {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
    gu: 'પ્રોફાઇલ',
  },

  // Product
  'product.add_to_cart': {
    en: 'Add to Cart',
    hi: 'कार्ट में जोड़ें',
    gu: 'કાર્ટમાં ઉમેરો',
  },
  'product.buy_now': {
    en: 'Buy Now',
    hi: 'अभी खरीदें',
    gu: 'હવે ખરીદો',
  },
  'product.place_bid': {
    en: 'Place Bid',
    hi: 'बोली लगाएं',
    gu: 'બિડ મૂકો',
  },

  // Auth
  'auth.login': {
    en: 'Login',
    hi: 'लॉग इन',
    gu: 'લોગિન',
  },
  'auth.signup': {
    en: 'Sign Up',
    hi: 'साइन अप',
    gu: 'સાઇન અપ',
  },
  'auth.logout': {
    en: 'Logout',
    hi: 'लॉग आउट',
    gu: 'લોગઆઉટ',
  },

  // Messages
  'message.chat_with_seller': {
    en: 'Chat with Seller',
    hi: 'विक्रेता से चैट करें',
    gu: 'વેચનાર સાથે ચેટ કરો',
  },
  'message.send': {
    en: 'Send',
    hi: 'भेजें',
    gu: 'મોકલો',
  },

  // Reviews
  'review.write_review': {
    en: 'Write a Review',
    hi: 'समीक्षा लिखें',
    gu: 'રિવ્યુ લખો',
  },
  'review.submit': {
    en: 'Submit Review',
    hi: 'समीक्षा जमा करें',
    gu: 'રિવ્યુ સબમિટ કરો',
  },

  // Disputes
  'dispute.report': {
    en: 'Report Issue',
    hi: 'समस्या रिपोर्ट करें',
    gu: 'સમસ્યા રિપોર્ટ કરો',
  },
  'dispute.resolve': {
    en: 'Resolve Dispute',
    hi: 'विवाद हल करें',
    gu: 'વિવાદ હલ કરો',
  },

  // Notifications
  'notification.new_message': {
    en: 'New Message',
    hi: 'नया संदेश',
    gu: 'નવો સંદેશ',
  },
  'notification.price_alert': {
    en: 'Price Alert',
    hi: 'मूल्य अलर्ट',
    gu: 'કિંમત એલર્ટ',
  },
  'notification.auction_update': {
    en: 'Auction Update',
    hi: 'नीलामी अपडेट',
    gu: 'એક્શન અપડેટ',
  },
};

export function useLanguage() {
  const { preferences, updateLanguage } = usePreferences();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(preferences.language);

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[currentLanguage] || translation.en;
  }, [currentLanguage]);

  const changeLanguage = useCallback(async (language: Language) => {
    try {
      await updateLanguage(language);
      setCurrentLanguage(language);
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  }, [updateLanguage]);

  // Sync with preferences
  useEffect(() => {
    setCurrentLanguage(preferences.language);
  }, [preferences.language]);

  return {
    currentLanguage,
    changeLanguage,
    t,
  };
} 