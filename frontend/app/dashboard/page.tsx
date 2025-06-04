"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
// import { useUser } from '@clerk/nextjs';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListOrdered, LayoutList, Star, MessageSquare, Heart, Settings, ShieldAlert, ShoppingBag, Edit2 } from 'lucide-react';

// Placeholder for app-specific user data type
interface AppUserProfile {
  username?: string; // Added for consistency with API doc
  email?: string; // Added for consistency
  profilePictureUrl?: string; // Added for consistency
  firstName?: string; // Added for consistency
  lastName?: string; // Added for consistency
  location?: string;
  aboutMe?: string;
  communicationPreferences?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
  };
  preferredLanguage?: string;
  sellerRating?: number;
  // Add other fields from API_DOCUMENTATION.md section 1.1
}

// Placeholder components for dashboard sections - can be moved to separate files later
const MyListings = () => <Card><CardHeader><CardTitle>My Listings</CardTitle></CardHeader><CardContent><p>List of user's active and past product listings. (CRUD operations for listings)</p></CardContent></Card>;
const MyPurchases = () => <Card><CardHeader><CardTitle>My Purchases</CardTitle></CardHeader><CardContent><p>History of items purchased by the user.</p></CardContent></Card>;
const SavedItems = () => <Card><CardHeader><CardTitle>Saved Items / Watchlist</CardTitle></CardHeader><CardContent><p>Items saved or watched by the user. (Price alerts)</p></CardContent></Card>;
const Messages = () => <Card><CardHeader><CardTitle>Messages</CardTitle></CardHeader><CardContent><p>User's chat conversations.</p></CardContent></Card>;
const ReviewsRatings = () => <Card><CardHeader><CardTitle>My Reviews & Ratings</CardTitle></CardHeader><CardContent><p>Reviews given and received by the user.</p></CardContent></Card>;
const MyDisputes = () => <Card><CardHeader><CardTitle>My Disputes</CardTitle></CardHeader><CardContent><p>History of disputes/complaints filed by or against the user.</p></CardContent></Card>;

// Updated AccountSettings to only use appUserProfile
const AccountSettings = ({ profile }: { profile: AppUserProfile | null }) => (
  <Card>
    <CardHeader>
      <CardTitle>Account Settings</CardTitle>
      <CardDescription>Manage your profile and preferences.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Removed Clerk Profile section */}
      <h3 className="font-semibold mt-0">EcoFinds Profile:</h3>
      <p>Username: {profile?.username || <span className="text-muted-foreground">N/A</span>}</p>
      <p>Email: {profile?.email || <span className="text-muted-foreground">N/A</span>}</p>
      <p>First Name: {profile?.firstName || <span className="text-muted-foreground">N/A</span>}</p>
      <p>Last Name: {profile?.lastName || <span className="text-muted-foreground">N/A</span>}</p>
      <p>Location: {profile?.location || <span className="text-muted-foreground">Not set</span>}</p>
      <p>About Me: {profile?.aboutMe || <span className="text-muted-foreground">Not set</span>}</p>
      <p>Preferred Language: {profile?.preferredLanguage || <span className="text-muted-foreground">Not set</span>}</p>
      {/* TODO: Add form to edit these app-specific fields -> PUT /api/users/me */}
      <Button variant="outline"><Edit2 className="w-4 h-4 mr-2" />Edit EcoFinds Profile</Button>
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const { appUser } = useAuth(); // Get appUser from AuthContext
  const [appUserProfile, setAppUserProfile] = useState<AppUserProfile | null>(null);
  const [isLoadingAppProfile, setIsLoadingAppProfile] = useState(true);

  useEffect(() => {
    // Fetch app-specific profile if appUser exists (i.e., user is logged in)
    if (appUser) { 
      const fetchAppUserProfile = async () => {
        setIsLoadingAppProfile(true);
        try {
          // TODO: Replace with actual API call to GET /api/users/me
          // This API should be protected and use the auth token from the user's session
          // For example: const response = await fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${appUser.token}` } });
          // if (!response.ok) throw new Error('Failed to fetch app user profile');
          // const data = await response.json();
          // setAppUserProfile(data);

          // Mock data for now, assuming appUser from context might be minimal (e.g. id, email, token)
          // and appUserProfile is the more detailed profile from /users/me.
          await new Promise(resolve => setTimeout(resolve, 500));
          setAppUserProfile({
            username: appUser.username || "EcoUser123", // Use username from context if available
            email: appUser.email || "user@example.com", // Use email from context if available
            firstName: appUser.firstName || "Eco",
            lastName: appUser.lastName || "User",
            profilePictureUrl: appUser.profilePictureUrl || undefined,
            location: "New York, USA",
            aboutMe: "Loves sustainable products and finding unique items!",
            preferredLanguage: "en",
            sellerRating: 4.7
          });

        } catch (error) {
          console.error("Error fetching app user profile:", error);
          setAppUserProfile(null); 
        } finally {
          setIsLoadingAppProfile(false);
        }
      };
      fetchAppUserProfile();
    } else {
      // Not signed in or appUser not available from context
      setIsLoadingAppProfile(false); // Not loading if no user to load for
      setAppUserProfile(null); // Ensure profile is cleared if user logs out
    }
  }, [appUser]); // Depend on appUser from context

  // Updated loading state
  if (isLoadingAppProfile && appUser) { // Only show loading if we have a user and are fetching their profile
    return <div className="container mx-auto px-4 py-8 text-center">Loading Dashboard...</div>;
  }

  // If no appUser (not logged in), redirect or show message
  // This might be handled by middleware or a Higher Order Component for protected routes too.
  if (!appUser) {
    return <div className="container mx-auto px-4 py-8 text-center">Please sign in to view your dashboard.</div>;
  }
  
  // Use appUserProfile for display, fallback to appUser from context for some fields if needed
  const displayUser = appUserProfile || appUser; 

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return `${firstName[0]}`.toUpperCase();
    if (username) return username.substring(0,2).toUpperCase();
    return "U";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayUser?.profilePictureUrl} alt={displayUser?.username || "User"} />
            <AvatarFallback>{getInitials(displayUser?.firstName, displayUser?.lastName, displayUser?.username)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome, {displayUser?.firstName || displayUser?.username || 'User'}!</h1>
            <p className="text-muted-foreground">Manage your EcoFinds account and activities.</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="listings"><LayoutList className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>My Listings</TabsTrigger>
          <TabsTrigger value="purchases"><ShoppingBag className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>Purchases</TabsTrigger>
          <TabsTrigger value="saved"><Heart className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>Saved Items</TabsTrigger>
          <TabsTrigger value="messages"><MessageSquare className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>Messages</TabsTrigger>
          <TabsTrigger value="reviews"><Star className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>Reviews</TabsTrigger>
          <TabsTrigger value="disputes"><ShieldAlert className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>Disputes</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2 sm:hidden md:inline-block"/>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings"><MyListings /></TabsContent>
        <TabsContent value="purchases"><MyPurchases /></TabsContent>
        <TabsContent value="saved"><SavedItems /></TabsContent>
        <TabsContent value="messages"><Messages /></TabsContent>
        <TabsContent value="reviews"><ReviewsRatings /></TabsContent>
        <TabsContent value="disputes"><MyDisputes /></TabsContent>
        {/* Pass the fetched appUserProfile to AccountSettings */} 
        <TabsContent value="settings"><AccountSettings profile={appUserProfile} /></TabsContent>
      </Tabs>
    </div>
  );
}
