# EcoFinds API Documentation

This document outlines the API endpoints and data structures that the EcoFinds frontend will interact with.

**Base URL:** `/api` (placeholder, actual backend URL to be configured)

**Authentication:**
User authentication is handled by Clerk. Frontend will use Clerk's SDKs for login, signup, and session management. API endpoints requiring authentication will expect a JWT token (obtained from Clerk) in the `Authorization: Bearer <token>` header. Backend will need to verify this token.

## 1. User Profile (App-Specific Data)

Refers to EcoFinds-specific user data beyond what Clerk manages directly (e.g., app preferences, detailed bio, full address for shipping if not in Clerk).

### 1.1. Get My User Profile
- **Endpoint:** `GET /users/me`
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "id": "clerk_user_id_or_db_uuid", // User ID, consistent with Clerk
    "clerkUserId": "string",
    "username": "string", // Managed by Clerk, but can be fetched
    "email": "user@example.com", // Managed by Clerk
    "phoneNumber": "+1234567890", // Managed by Clerk
    "profilePictureUrl": "string", // Managed by Clerk
    "firstName": "string", // Managed by Clerk
    "lastName": "string", // Managed by Clerk
    "location": "string", // App-specific
    "aboutMe": "string", // App-specific bio
    "communicationPreferences": {
      "emailNotifications": true,
      "smsNotifications": false,
      "pushNotifications": true
    }, // App-specific
    "preferredLanguage": "en" | "hi" | "gu", // App-specific
    "paymentMethods": [ // Simplified, details might be handled by a payment provider
      {
        "id": "payment_method_id",
        "type": "upi" | "card" | "netbanking", // Example types
        "details": "xxxx xxxx xxxx 1234 / a@b.upi", // Masked or reference
        "isDefault": true
      }
    ],
    "sellerRating": 4.5, // Average rating as a seller
    "joinedAt": "iso_timestamp" // Clerk's user creation date
  }
  ```

### 1.2. Update My User Profile
- **Endpoint:** `PUT /users/me`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "location": "string",
    "aboutMe": "string",
    "communicationPreferences": {
      "emailNotifications": true,
      "smsNotifications": false,
      "pushNotifications": true
    },
    "preferredLanguage": "en" | "hi" | "gu",
    // Payment methods might be managed via a separate endpoint or integrated payment provider
  }
  ```
- **Response:** `200 OK` (Returns updated User Profile object - see 1.1)

## 2. Products

### 2.1. List Products (Browse, Search, Filter)
- **Endpoint:** `GET /products`
- **Auth:** Optional (for personalized results if logged in)
- **Query Parameters:**
  - `search`: string (keyword search in title/description)
  - `category`: string (category ID or slug)
  - `condition`: "new" | "like_new" | "good" | "fair" | "used_acceptable"
  - `sellerId`: string (user ID of the seller)
  - `minPrice`: number
  - `maxPrice`: number
  - `location`: string (e.g., "city, state" or coordinates for distance-based filtering - advanced)
  - `sortBy`: "newest" | "price_asc" | "price_desc" | "distance_asc" (default: "newest")
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
  - `isAuction`: boolean (filter by auction items)
- **Response:** `200 OK`
  ```json
  {
    "products": [
      // Array of Product objects (see 2.2 for structure, with auction details if applicable)
    ],
    "totalPages": 10,
    "currentPage": 1,
    "totalCount": 200
  }
  ```

### 2.2. Get Product Details
- **Endpoint:** `GET /products/{productId}`
- **Auth:** Optional
- **Response:** `200 OK`
  ```json
  {
    "id": "product_uuid",
    "title": "string",
    "description": "string",
    "category": { "id": "cat_id", "name": "Electronics" },
    "price": 100.00, // For non-auction items
    "images": ["url1", "url2"], // Placeholder for at least one image
    "condition": "good",
    "seller": {
      "id": "seller_user_id",
      "username": "string",
      "profilePictureUrl": "string",
      "rating": 4.5,
      "location": "string"
    },
    "postedAt": "iso_timestamp",
    "updatedAt": "iso_timestamp",
    "isAuction": false, // boolean
    // Auction-specific fields (if isAuction is true)
    "auctionDetails": {
      "minimumBid": 50.00,
      "reservePrice": 75.00, // Optional
      "auctionEndTime": "iso_timestamp",
      "currentHighestBid": 65.00, // Can be null if no bids yet
      "totalBids": 5,
      "bids": [ // Optionally, a few recent bids or just the highest
        { "bidderId": "user_id", "bidderUsername": "string", "amount": 65.00, "timestamp": "iso_timestamp" }
      ]
    }
  }
  ```

### 2.3. Create Product Listing
- **Endpoint:** `POST /products`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "categoryId": "cat_id",
    "price": 100.00, // Required if not an auction or for "Buy Now" price on an auction
    "images": ["base64_encoded_image_or_presigned_url_id"], // Backend needs to handle image uploads
    "condition": "good",
    "isAuction": false,
    "auctionDetails": { // Required if isAuction is true
      "minimumBid": 50.00,
      "reservePrice": 75.00, // Optional
      "auctionDurationHours": 72 // Or specific end time
    }
  }
  ```
- **Response:** `201 Created` (Returns created Product object - see 2.2)

### 2.4. Update Product Listing
- **Endpoint:** `PUT /products/{productId}`
- **Auth:** Required (user must be owner)
- **Request Body:** (Similar to 2.3, only include fields to update)
- **Response:** `200 OK` (Returns updated Product object - see 2.2)

### 2.5. Delete Product Listing
- **Endpoint:** `DELETE /products/{productId}`
- **Auth:** Required (user must be owner)
- **Response:** `204 No Content`

### 2.6. Get My Listings
- **Endpoint:** `GET /products/my-listings`
- **Auth:** Required
- **Query Parameters:** (similar to 2.1 for filtering own listings, e.g., active, sold, auction status)
- **Response:** `200 OK` (Paginated list of Product objects)

## 3. Auctions

Auction details are part of the Product object (see 2.2).

### 3.1. Place Bid
- **Endpoint:** `POST /products/{productId}/bids`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "amount": 70.00
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "bidId": "bid_uuid",
    "productId": "product_uuid",
    "bidderId": "user_id",
    "amount": 70.00,
    "timestamp": "iso_timestamp",
    "isHighestBid": true // Optional, or implied
  }
  ```
  Alternatively, could return the updated Product object with new bid information.

### 3.2. Get Bids for an Auction
- **Endpoint:** `GET /products/{productId}/bids`
- **Auth:** Optional (or required depending on privacy settings)
- **Response:** `200 OK`
  ```json
  {
    "bids": [
      { "bidderId": "user_id", "bidderUsername": "string", "amount": 65.00, "timestamp": "iso_timestamp" },
      { "bidderId": "another_user_id", "bidderUsername": "string", "amount": 60.00, "timestamp": "iso_timestamp" }
    ],
    "currentHighestBid": 65.00,
    "totalBids": 10
  }
  ```
  (Real-time updates for bids would ideally use WebSockets.)

## 4. Personalized Recommendations & Saved Items

### 4.1. Get Personalized Recommendations
- **Endpoint:** `GET /recommendations`
- **Auth:** Required
- **Query Parameters:**
  - `context`: "homepage" | "product_detail" | "cart" (to tailor recommendations)
  - `productId`: string (if context is product_detail, for similar items)
  - `limit`: number (default: 10)
- **Response:** `200 OK`
  ```json
  {
    "products": [
      // Array of Product objects
    ]
  }
  ```

### 4.2. Saved Searches & Price Alerts (Watchlist)

#### 4.2.1. Save a Search
- **Endpoint:** `POST /saved-searches`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "name": "Vintage T-Shirts", // Optional user-defined name
    "queryParameters": { // Object containing query params from Product Listing (see 2.1)
      "search": "vintage t-shirt",
      "category": "clothing",
      "maxPrice": 50
    }
  }
  ```
- **Response:** `201 Created` (Returns the saved search object)

#### 4.2.2. List Saved Searches
- **Endpoint:** `GET /saved-searches`
- **Auth:** Required
- **Response:** `200 OK` (Array of saved search objects)

#### 4.2.3. Delete Saved Search
- **Endpoint:** `DELETE /saved-searches/{savedSearchId}`
- **Auth:** Required
- **Response:** `204 No Content`

#### 4.2.4. Watch an Item (for price drops / auction updates)
- **Endpoint:** `POST /watchlist`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "productId": "product_uuid"
  }
  ```
- **Response:** `201 Created` or `200 OK` if already watched
  ```json
  {
    "watchlistItemId": "uuid",
    "productId": "product_uuid",
    "userId": "user_uuid",
    "addedAt": "iso_timestamp"
  }
  ```

#### 4.2.5. List Watched Items
- **Endpoint:** `GET /watchlist`
- **Auth:** Required
- **Response:** `200 OK` (Array of Product objects that are watched)

#### 4.2.6. Unwatch an Item
- **Endpoint:** `DELETE /watchlist/{productId}` (or use `watchlistItemId`)
- **Auth:** Required
- **Response:** `204 No Content`


## 5. Cart & Checkout (Simplified)

### 5.1. Get Cart
- **Endpoint:** `GET /cart`
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "id": "cart_uuid",
    "userId": "user_uuid",
    "items": [
      {
        "cartItemId": "item_uuid",
        "product": { /* Partial Product object: id, title, price, image, sellerId */ },
        "quantity": 1,
        "addedAt": "iso_timestamp"
      }
    ],
    "subtotal": 150.00,
    "estimatedShipping": 10.00, // Example, could be complex
    "total": 160.00
  }
  ```

### 5.2. Add to Cart
- **Endpoint:** `POST /cart/items`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "productId": "product_uuid",
    "quantity": 1
  }
  ```
- **Response:** `201 Created` (Returns updated Cart object or the added CartItem)

### 5.3. Update Cart Item Quantity
- **Endpoint:** `PUT /cart/items/{cartItemId}`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "quantity": 2
  }
  ```
- **Response:** `200 OK` (Returns updated Cart object or the updated CartItem)

### 5.4. Remove from Cart
- **Endpoint:** `DELETE /cart/items/{cartItemId}`
- **Auth:** Required
- **Response:** `200 OK` (Returns updated Cart object) or `204 No Content`

### 5.5. Previous Purchases (Order History)
- **Endpoint:** `GET /orders/history`
- **Auth:** Required
- **Query Parameters:**
  - `page`: number
  - `limit`: number
- **Response:** `200 OK`
  ```json
  {
    "orders": [
      {
        "orderId": "order_uuid",
        "items": [ /* product snapshot: title, price, image */ ],
        "totalAmount": 160.00,
        "orderDate": "iso_timestamp",
        "status": "completed" | "shipped" | "pending_payment",
        "sellerInfo": { /* seller id, name for each item if multiple sellers */ }
      }
    ],
    "totalPages": 5,
    "currentPage": 1
  }
  ```
(Actual order creation `POST /orders` would involve payment integration and is complex, focusing on viewing history here).

## 6. Direct Chat / Messaging

(WebSockets are highly recommended for real-time chat)

### 6.1. List Chat Conversations
- **Endpoint:** `GET /chats`
- **Auth:** Required
- **Response:** `200 OK`
  ```json
  {
    "conversations": [
      {
        "id": "chat_uuid",
        "participants": [
          { "userId": "user_id_1", "username": "User1" },
          { "userId": "user_id_2", "username": "User2" }
        ],
        "lastMessage": {
          "text": "Hi there!",
          "timestamp": "iso_timestamp",
          "senderId": "user_id_1"
        },
        "unreadCount": 2,
        "relatedProduct": { // Optional, if chat initiated from a product
          "id": "product_uuid",
          "title": "Product Title",
          "imageUrl": "string"
        }
      }
    ]
  }
  ```

### 6.2. Get Messages in a Conversation
- **Endpoint:** `GET /chats/{chatId}/messages`
- **Auth:** Required
- **Query Parameters:**
  - `before`: iso_timestamp (for pagination, load older messages)
  - `limit`: number (default: 50)
- **Response:** `200 OK`
  ```json
  {
    "messages": [
      {
        "id": "message_uuid",
        "chatId": "chat_uuid",
        "senderId": "user_id",
        "senderUsername": "string",
        "text": "Hello!",
        "timestamp": "iso_timestamp",
        "isRead": true
      }
    ]
  }
  ```

### 6.3. Send Message
- **Endpoint:** `POST /chats/{chatId}/messages`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "text": "Is this item still available?"
  }
  ```
- **Response:** `201 Created` (Returns the created Message object)

### 6.4. Initiate Chat (e.g., "Chat with Seller")
- **Endpoint:** `POST /chats/initiate`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "recipientId": "seller_user_id",
    "productId": "product_uuid" // Optional, to link chat to a product
  }
  ```
- **Response:** `200 OK` or `201 Created` (Returns the Chat Conversation object, existing or new)

## 7. User Ratings & Reviews

### 7.1. Submit Review
- **Endpoint:** `POST /reviews`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "targetUserId": "seller_or_buyer_user_id",
    "orderId": "order_uuid", // To verify transaction occurred
    "rating": 5, // 1-5 stars
    "comment": "Great seller, fast shipping!"
  }
  ```
- **Response:** `201 Created` (Returns the created Review object)

### 7.2. Get Reviews for a User
- **Endpoint:** `GET /users/{userId}/reviews`
- **Auth:** Optional
- **Query Parameters:**
  - `role`: "seller" | "buyer" (filter reviews received as seller or buyer)
- **Response:** `200 OK`
  ```json
  {
    "reviews": [
      {
        "id": "review_uuid",
        "reviewerId": "user_id",
        "reviewerUsername": "string",
        "targetUserId": "user_id",
        "orderId": "order_uuid",
        "rating": 5,
        "comment": "Excellent!",
        "timestamp": "iso_timestamp"
      }
    ],
    "averageRating": 4.7,
    "totalReviews": 50
  }
  ```

## 8. Dispute Resolution (User-Facing)

### 8.1. Report a Dispute
- **Endpoint:** `POST /disputes`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "orderId": "order_uuid",
    "reason": "item_not_as_described" | "not_received" | "payment_issue",
    "description": "Detailed explanation of the issue.",
    "desiredOutcome": "Refund / Exchange / etc." // Optional
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "disputeId": "dispute_uuid",
    "orderId": "order_uuid",
    "status": "open",
    "createdAt": "iso_timestamp"
  }
  ```

### 8.2. List My Disputes
- **Endpoint:** `GET /disputes/my-disputes`
- **Auth:** Required
- **Response:** `200 OK` (Array of Dispute objects with status, history updates)

### 8.3. Add Message/Evidence to Dispute
- **Endpoint:** `POST /disputes/{disputeId}/messages`
- **Auth:** Required (participant in dispute)
- **Request Body:**
  ```json
  {
    "text": "Here is a photo of the item.",
    "attachmentUrl": "url_to_uploaded_evidence" // Backend handles attachment uploads
  }
  ```
- **Response:** `201 Created` (Returns the message/evidence object)

## 9. Admin Features

These endpoints require special admin privileges/roles.

### 9.1. Admin: List Complaints/Disputes
- **Endpoint:** `GET /admin/disputes`
- **Auth:** Required (Admin role)
- **Query Parameters:** `status`, `userId`, `dateRange`, etc.
- **Response:** `200 OK` (Paginated list of all Dispute objects)

### 9.2. Admin: Get Dispute Details
- **Endpoint:** `GET /admin/disputes/{disputeId}`
- **Auth:** Required (Admin role)
- **Response:** `200 OK` (Full Dispute object including all messages, evidence, involved user details)

### 9.3. Admin: Update Dispute Status / Add Admin Note
- **Endpoint:** `PUT /admin/disputes/{disputeId}`
- **Auth:** Required (Admin role)
- **Request Body:**
  ```json
  {
    "status": "resolved" | "pending_user_action" | "closed",
    "resolutionNotes": "Admin decision and reasoning." // Internal or shared note
  }
  ```
- **Response:** `200 OK` (Updated Dispute object)


## 10. Categories
### 10.1. List Categories
- **Endpoint:** `GET /categories`
- **Auth:** Optional
- **Response:** `200 OK`
  ```json
  [
    { "id": "cat_id_1", "name": "Electronics", "slug": "electronics", "subcategories": [/* ... */] },
    { "id": "cat_id_2", "name": "Clothing", "slug": "clothing" },
    { "id": "cat_id_3", "name": "Furniture", "slug": "furniture" }
  ]
  ```

## 11. General / Utility
### 11.1 Image Upload (Conceptual)
The frontend will likely need a way to upload images for products, profile pictures, dispute evidence, etc. This usually involves:
1.  Frontend requests a pre-signed URL from the backend:
    - **Endpoint:** `POST /uploads/presigned-url`
    - **Auth:** Required
    - **Request Body:** `{ "fileName": "image.jpg", "contentType": "image/jpeg", "context": "product_image" | "profile_avatar" }`
    - **Response:** `{ "uploadUrl": "s3_presigned_url", "fileId": "unique_file_id_to_reference_later" }`
2.  Frontend uploads the file directly to the `uploadUrl` (e.g., S3).
3.  Frontend sends the `fileId` (or the final URL of the uploaded image if known) to the relevant API endpoint (e.g., when creating/updating a product).

Backend needs to handle image processing, storage, and serving.

---

**WebSocket Events (Conceptual for Real-time Features):**

- `new_bid`: Sent when a new bid is placed on an auction.
  - Payload: `{ "productId": "...", "bid": { ... } }`
- `auction_ending_soon`: Sent when an auction is about to close.
  - Payload: `{ "productId": "...", "endTime": "..." }`
- `auction_ended`: Sent when an auction closes.
  - Payload: `{ "productId": "...", "winnerId": "...", "finalPrice": ... }`
- `new_message`: Sent when a new chat message is received.
  - Payload: `{ "chatId": "...", "message": { ... } }`
- `notification`: Generic notification for price alerts, new listings in saved searches, etc.
  - Payload: `{ "type": "price_alert" | "new_listing", "data": { ... } }`

---
This API documentation should cover the core functionalities described. Further details can be added as implementation progresses. 