"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  email: string;
  // Add other relevant user properties
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => void;
  // verifyOtp: (otp: string) => Promise<boolean>; // Example for OTP verification
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      // TODO: Add a call to a backend endpoint (e.g., /api/auth/me) to validate the token
      // and fetch user data if the token is valid.
      // For now, we'll just set the token if it exists.
      // If the token is invalid or expired, the backend should reject it,
      // and we should clear it from localStorage.

      if (storedToken) {
        setToken(storedToken);
        // Placeholder for fetching user data based on token
        // For example:
        // try {
        //   const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${storedToken}` }});
        //   if (res.ok) {
        //     const userData = await res.json();
        //     setUser(userData);
        //   } else {
        //     localStorage.removeItem('jwtToken');
        //     setToken(null);
        //     setUser(null);
        //   }
        // } catch (error) {
        //   console.error("Failed to fetch user data", error);
        //   localStorage.removeItem('jwtToken');
        //   setToken(null);
        //   setUser(null);
        // }
        // For demonstration, let's assume the token itself contains enough info or we mock user
        // In a real app, you MUST verify the token with the backend and get user details.
        // For now, if a token exists, we'll try to parse it (if it's a JWT with user data)
        // or fetch user data. This part is highly dependent on your JWT structure.
        // For simplicity, we'll set a placeholder user if a token is found.
        // This is NOT secure for a real application.
        try {
          // Attempt to decode token to get basic info (e.g., expiry).
          // This is just for client-side convenience and not a security measure.
          // const decodedToken = JSON.parse(atob(storedToken.split('.')[1])); // Basic decode
          // if (decodedToken.exp * 1000 < Date.now()) {
          //   localStorage.removeItem('jwtToken');
          //   setToken(null);
          //   setUser(null);
          // } else {
          //   // setUser(decodedToken.user || { id: decodedToken.sub, username: 'User' }); // Example
          //   // Fetch user from backend using the token
          // }
        } catch (e) {
          // console.error("Invalid token:", e);
          // localStorage.removeItem('jwtToken');
          // setToken(null);
          // setUser(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const signIn = async (newToken: string, userData: User) => {
    setIsLoading(true);
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
    setUser(userData);
    setIsLoading(false);
    // router.push('/dashboard'); // Redirect after sign-in
  };

  const signOut = () => {
    setIsLoading(true);
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);
    setIsLoading(false);
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 