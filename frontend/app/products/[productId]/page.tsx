import { getProductById } from "@/lib/actions/product.actions";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Assuming this will exist or be created
import { Clock, Tag, Users, MessageSquare, ShieldCheck, ShoppingCart, Landmark, Edit3, Trash2 } from 'lucide-react';
// import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react"; // Import React for JSX
import ProductInteractionControls from "@/components/product-interaction-controls"; // New component

// Helper to format date (optional)
const formatDate = (isoString: string | undefined) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = await getProductById(params.productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-muted rounded-lg overflow-hidden aspect-square">
            <img 
              src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/600x600.png?text=Product+Image'}
              alt={product.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, index) => (
                <button key={index} className="bg-muted rounded-md overflow-hidden aspect-square hover:ring-2 ring-primary focus:outline-none">
                  <img src={img} alt={`${product.title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && <Badge variant="outline" className="mb-2">{product.category.name}</Badge>}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.title}</h1>
            {product.seller && (
              <div className="text-sm text-muted-foreground mt-2">
                Sold by <Link href={`/user/${product.seller.id}`} className="text-primary hover:underline">{product.seller.username}</Link>
                {product.seller.rating && <span className="ml-2">({product.seller.rating} ★)</span>}
              </div>
            )}
          </div>

          <div className="text-3xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </div>
          
          {product.condition && (
            <div className="flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-muted-foreground">Condition: <span className="font-medium text-foreground">{product.condition}</span></span>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none text-muted-foreground">
            <p>{product.description || 'No description available.'}</p>
          </div>

          {/* Pass product to the new client component */}
          <ProductInteractionControls product={product} />

          <div className="pt-6">
            <h4 className="font-semibold mb-2 text-foreground">Share this item:</h4>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" aria-label="Share on X">X</Button> {/* Placeholder for actual sharing icons/logic */}
                <Button variant="outline" size="icon" aria-label="Share on Facebook">FB</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="border rounded-lg p-4 shadow bg-card text-card-foreground">
              <div className="w-full h-32 bg-muted rounded-md mb-3 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 