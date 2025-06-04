# Higo Backend

A Node.js/Express backend for Higo, a second-hand marketplace application.

## Features

- User authentication and authorization
- Product listing and management
- Auction system
- Real-time chat between buyers and sellers
- User reviews and ratings
- Product search with filters
- Location-based search
- Save products for later

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/higo
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user

### Products
- GET /api/products - Get all products (with filters)
- GET /api/products/:id - Get a specific product
- POST /api/products - Create a new product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product
- POST /api/products/:id/bid - Place a bid on an auction
- POST /api/products/:id/save - Save/unsave a product

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users/:userId/products - Get user's products
- GET /api/users/:userId/reviews - Get user's reviews
- POST /api/users/:userId/reviews - Add a review for a user

### Messages
- POST /api/messages - Send a message
- GET /api/messages/conversations - Get all conversations
- GET /api/messages/:productId/:userId - Get messages for a specific conversation
- PUT /api/messages/:messageId/read - Mark a message as read

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## License

MIT 