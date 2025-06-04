"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  // Define app-specific auth state or user profile data here if needed
  // For now, let's assume a simple isAuthenticated or user object might go here
  // This can be expanded based on what's not covered by Clerk
  appUser: any | null; // Placeholder for app-specific user data
  setAppUser: (user: any | null) => void; // Kept for direct manipulation if needed, though signIn/signOut are preferred
  signIn: (userData: any) => void; // Function to handle user sign-in
  signOut: () => void; // Function to handle user sign-out
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [appUser, setAppUser] = useState<any | null>(null);

  // Placeholder signIn function
  const signIn = (userData: any) => {
    // In a real app, you would typically call your backend to authenticate
    // and then set the user data upon successful authentication.
    // You might also store a token (e.g., JWT) in localStorage/sessionStorage.
    console.log("AuthContext: Signing in user", userData);
    setAppUser(userData);
    // Example: router.push('/dashboard'); (if using next/navigation)
  };

  // Placeholder signOut function
  const signOut = () => {
    // In a real app, you would call your backend to invalidate the session/token
    // and clear any stored tokens.
    console.log("AuthContext: Signing out user");
    setAppUser(null);
    // Example: router.push('/login'); (if using next/navigation)
  };

  // Logic to fetch and set app-specific user data can be added here,
  // potentially interacting with the /api/users/me endpoint after successful signIn.

  return (
    <AuthContext.Provider value={{ appUser, setAppUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 