"use client";

import React from 'react';
// import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Define interfaces for filter options based on API_DOCUMENTATION.md (2.1 List Products)
// For example, categories might come from GET /categories endpoint

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories?: Category[]; // To be fetched from API
  // Add other filter criteria props as needed (e.g., conditions, price ranges)
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const pathname = usePathname();

  // const handleFilterChange = (filterType: string, value: string) => {
  //   const current = new URLSearchParams(Array.from(searchParams.entries()));
  //   if (!value) {
  //     current.delete(filterType);
  //   } else {
  //     current.set(filterType, value);
  //   }
  //   const search = current.toString();
  //   const query = search ? `?${search}` : "";
  //   router.push(`${pathname}${query}`);
  // };

  return (
    <div className="p-4 border rounded-lg bg-card shadow-sm space-y-6">
      <h3 className="text-xl font-semibold text-card-foreground">Filters</h3>
      
      {/* Category Filter */}
      <div>
        <label htmlFor="category-filter" className="block text-sm font-medium text-muted-foreground mb-1">
          Category
        </label>
        <select 
          id="category-filter"
          // value={searchParams.get('category') || ''}
          // onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
        >
          <option value="">All Categories</option>
          {categories && categories.map(cat => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
          {/* Placeholder categories if not passed as props */}
          {!categories && (
            <>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
            </>
          )}
        </select>
      </div>

      {/* Condition Filter */}
      <div>
        <label htmlFor="condition-filter" className="block text-sm font-medium text-muted-foreground mb-1">
          Condition
        </label>
        <select 
          id="condition-filter"
          // value={searchParams.get('condition') || ''}
          // onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
        >
          <option value="">Any Condition</option>
          <option value="new">New</option>
          <option value="like_new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="used_acceptable">Used - Acceptable</option>
        </select>
      </div>

      {/* Price Range Filter (Simplified) */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min $"
            // value={searchParams.get('minPrice') || ''}
            // onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max $"
            // value={searchParams.get('maxPrice') || ''}
            // onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-background text-foreground"
          />
        </div>
      </div>
      
      {/* Apply Filters Button (if not applying on change) */}
      {/* <button 
        onClick={() => { 
          // Construct query and navigate if filters are applied via button 
        }}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Apply Filters
      </button> */}
    </div>
  );
} 