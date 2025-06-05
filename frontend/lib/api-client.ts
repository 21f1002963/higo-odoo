import { Product, ProductSearchParams } from './actions/product.actions';
import { Review } from './actions/review.actions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product endpoints
  async getProducts(params: ProductSearchParams): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    return this.request<Product[]>(`/products?${queryParams.toString()}`);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Auction endpoints
  async placeBid(productId: string, amount: number): Promise<{ bidId: string }> {
    return this.request<{ bidId: string }>(`/products/${productId}/bids`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getBids(productId: string): Promise<{
    bids: Array<{
      bidderId: string;
      bidderUsername: string;
      amount: number;
      timestamp: string;
    }>;
    currentHighestBid: number;
    totalBids: number;
  }> {
    return this.request(`/products/${productId}/bids`);
  }

  // User profile endpoints
  async getUserProfile(): Promise<any> {
    return this.request('/users/me');
  }

  async updateUserProfile(profile: any): Promise<any> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Cart endpoints
  async getCart(): Promise<any> {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<any> {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<void> {
    return this.request(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  }

  // Chat endpoints
  async getChats(): Promise<any[]> {
    return this.request('/chats');
  }

  async getChatMessages(chatId: string): Promise<any[]> {
    return this.request(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, content: string): Promise<any> {
    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Saved searches endpoints
  async getSavedSearches(): Promise<any[]> {
    return this.request('/saved-searches');
  }

  async saveSearch(data: { name: string; queryParameters: ProductSearchParams }): Promise<any> {
    return this.request('/saved-searches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSavedSearch(searchId: string): Promise<void> {
    return this.request(`/saved-searches/${searchId}`, {
      method: 'DELETE',
    });
  }

  // Price alerts endpoints
  async getPriceAlerts(): Promise<any[]> {
    return this.request('/price-alerts');
  }

  async createPriceAlert(productId: string, targetPrice: number): Promise<any> {
    return this.request('/price-alerts', {
      method: 'POST',
      body: JSON.stringify({ productId, targetPrice }),
    });
  }

  async deletePriceAlert(alertId: string): Promise<void> {
    return this.request(`/price-alerts/${alertId}`, {
      method: 'DELETE',
    });
  }

  // Recommendations endpoints
  async getRecommendations(context: 'homepage' | 'product_detail' | 'cart', productId?: string): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('context', context);
    if (productId) {
      queryParams.append('productId', productId);
    }
    return this.request<Product[]>(`/recommendations?${queryParams.toString()}`);
  }

  // Dispute resolution endpoints
  async createDispute(data: {
    productId: string;
    reason: string;
    description: string;
    evidence?: string[];
  }): Promise<any> {
    return this.request('/disputes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDisputes(): Promise<any[]> {
    return this.request('/disputes');
  }

  async getDisputeDetails(disputeId: string): Promise<any> {
    return this.request(`/disputes/${disputeId}`);
  }

  async updateDisputeStatus(disputeId: string, status: string): Promise<any> {
    return this.request(`/disputes/${disputeId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Admin endpoints
  async getComplaints(): Promise<any[]> {
    return this.request('/admin/complaints');
  }

  async getComplaintDetails(complaintId: string): Promise<any> {
    return this.request(`/admin/complaints/${complaintId}`);
  }

  async updateComplaintStatus(complaintId: string, status: string): Promise<any> {
    return this.request(`/admin/complaints/${complaintId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Review endpoints
  async getProductReviews(productId: string): Promise<Review[]> {
    const response = await this.request<Review[]>(`/products/${productId}/reviews`);
    return response;
  }

  async createProductReview(productId: string, data: { rating: number; comment: string }): Promise<Review> {
    const response = await this.request<Review>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateProductReview(reviewId: string, data: { rating: number; comment: string }): Promise<Review> {
    const response = await this.request<Review>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteProductReview(reviewId: string): Promise<void> {
    await this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async getNotifications(): Promise<Notification[]> {
    const response = await this.request<Notification[]>('/notifications');
    return response;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(); 