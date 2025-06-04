"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming this exists or will be created
import { Label } from "@/components/ui/label"; // Assuming this exists or will be created
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming this exists
import { Checkbox } from "@/components/ui/checkbox"; // Assuming this exists
import { UploadCloud, DollarSign, Tag, Type, Info, Clock, Percent, ShieldAlert } from 'lucide-react';

// Mock categories - in a real app, fetch from API: GET /api/categories
const mockCategories = [
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Clothing & Apparel' },
  { id: 'cat3', name: 'Furniture' },
  { id: 'cat4', name: 'Books & Media' },
  { id: 'cat5', name: 'Home & Garden' },
  { id: 'cat6', name: 'Sports & Outdoors' },
  { id: 'cat7', name: 'Toys & Hobbies' },
  { id: 'cat8', name: 'Collectibles & Art' },
  { id: 'cat9', name: 'Vehicles' },
  { id: 'cat10', name: 'Other' },
];

const productConditions = [
  { id: "new", name: "New" },
  { id: "like_new", name: "Like New" },
  { id: "good", name: "Good" },
  { id: "fair", name: "Fair" },
  { id: "used_acceptable", name: "Used - Acceptable" },
];

export default function SellPage() {
  const router = useRouter();
  const [isAuction, setIsAuction] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form state - can be managed with react-hook-form for more complex validation
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '', // Stored as string for input, convert to number on submit
    condition: 'good',
    // images will be handled by a separate state/upload logic
    minimumBid: '',
    reservePrice: '',
    auctionDurationHours: '72',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5)); // Limit to 5 previews
      // TODO: Handle actual file uploads, e.g., store File objects in state
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form submitted", { ...formData, isAuction, images: imagePreviews /* replace with actual file data */ });

    // Construct payload based on API_DOCUMENTATION.md (2.3. Create Product Listing)
    const payload: any = {
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      condition: formData.condition,
      isAuction: isAuction,
      // images: ["base64_encoded_image_or_presigned_url_id"] // Placeholder for actual image handling
    };

    if (isAuction) {
      payload.auctionDetails = {
        minimumBid: parseFloat(formData.minimumBid) || 0,
        auctionDurationHours: parseInt(formData.auctionDurationHours) || 72,
      };
      if (formData.reservePrice) {
        payload.auctionDetails.reservePrice = parseFloat(formData.reservePrice);
      }
      // If auction also has a "Buy Now" price, it would be set on `price` field.
      if (formData.price) { // Allow Buy Now price for auctions
        payload.price = parseFloat(formData.price);
      }
    } else {
      payload.price = parseFloat(formData.price) || 0;
    }

    // TODO: Replace with actual API call: POST /api/products
    // For now, simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // const response = await fetch('/api/products', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json', /* Add Auth token */ },
      //   body: JSON.stringify(payload)
      // });
      // if (!response.ok) throw new Error('Failed to create listing');
      // const newProduct = await response.json();
      // router.push(`/products/${newProduct.id}`); // Redirect to new product page
      alert("Listing created successfully! (Mock response)\nRedirecting...");
      router.push('/products'); // Temporary redirect
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        
        {/* Basic Information Section */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold flex items-center text-card-foreground"><Info className="w-5 h-5 mr-2 text-primary"/>Basic Information</h2>
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Product Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Vintage Leather Jacket" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your item in detail..." required rows={4} className="mt-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryId" className="text-sm font-medium">Category</Label>
              <Select name="categoryId" value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)} required>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition" className="text-sm font-medium">Condition</Label>
              <Select name="condition" value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)} required>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {productConditions.map(cond => (
                    <SelectItem key={cond.id} value={cond.id}>{cond.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4 border-b pb-6">
            <h2 className="text-xl font-semibold flex items-center text-card-foreground"><UploadCloud className="w-5 h-5 mr-2 text-primary"/>Product Images</h2>
            <Label htmlFor="images" className="block text-sm font-medium text-muted-foreground">Upload up to 5 images. The first image will be the primary.</Label>
            <Input id="images" name="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {imagePreviews.map((src, index) => (
                        <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md border" />
                    ))}
                </div>
            )}
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 border-b pb-6">
            <h2 className="text-xl font-semibold flex items-center text-card-foreground"><DollarSign className="w-5 h-5 mr-2 text-primary"/>Pricing</h2>
            <div className="flex items-center space-x-3">
                <Checkbox id="isAuction" checked={isAuction} onCheckedChange={(checked) => setIsAuction(checked as boolean)} />
                <Label htmlFor="isAuction" className="text-sm font-medium">List as Auction?</Label>
            </div>

            {!isAuction ? (
                <div>
                    <Label htmlFor="price" className="text-sm font-medium">Price (USD)</Label>
                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="e.g., 29.99" required={!isAuction} step="0.01" min="0" className="mt-1"/>
                </div>
            ) : (
                <div className="space-y-4 p-4 border rounded-md bg-secondary/30">
                    <h3 className="text-md font-medium text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2"/>Auction Settings</h3>
                    <div>
                        <Label htmlFor="minimumBid" className="text-sm font-medium">Starting Bid (USD)</Label>
                        <Input id="minimumBid" name="minimumBid" type="number" value={formData.minimumBid} onChange={handleInputChange} placeholder="e.g., 9.99" required={isAuction} step="0.01" min="0" className="mt-1"/>
                    </div>
                    <div>
                        <Label htmlFor="reservePrice" className="text-sm font-medium">Reserve Price (USD) <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                        <Input id="reservePrice" name="reservePrice" type="number" value={formData.reservePrice} onChange={handleInputChange} placeholder="e.g., 50.00" step="0.01" min="0" className="mt-1"/>
                    </div>
                    <div>
                        <Label htmlFor="auctionDurationHours" className="text-sm font-medium">Auction Duration</Label>
                        <Select name="auctionDurationHours" value={formData.auctionDurationHours} onValueChange={(value) => handleSelectChange('auctionDurationHours', value)} required={isAuction}>
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24">24 Hours</SelectItem>
                                <SelectItem value="48">48 Hours (2 Days)</SelectItem>
                                <SelectItem value="72">72 Hours (3 Days)</SelectItem>
                                <SelectItem value="120">120 Hours (5 Days)</SelectItem>
                                <SelectItem value="168">168 Hours (7 Days)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="price" className="text-sm font-medium">Buy Now Price (USD) <span className="text-xs text-muted-foreground">(Optional for Auctions)</span></Label>
                        <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="e.g., 79.99" step="0.01" min="0" className="mt-1"/>
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? (
                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : "Create Listing"}
          </Button>
        </div>

      </form>
    </div>
  );
} 