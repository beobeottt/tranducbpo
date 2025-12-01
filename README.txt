================================================================================
                    TRANDUCBPO E-COMMERCE PLATFORM
                    Project Documentation & Setup Guide
================================================================================

PROJECT OVERVIEW
================================================================================
This is a full-stack e-commerce platform built with NestJS (Backend) and React 
(TypeScript) (Frontend). The system includes user authentication, product 
management, shopping cart, order processing, payment integration (VNPay), 
real-time features via WebSocket, AI-powered chat assistant, and an admin 
dashboard.

Technology Stack:
- Backend: NestJS, TypeScript, MongoDB, Mongoose, Socket.IO, Elasticsearch
- Frontend: React 18, TypeScript, TailwindCSS, React Router, Axios
- Payment: VNPay Sandbox Integration
- Real-time: WebSocket (Socket.IO)
- Search: Elasticsearch
- AI: OpenAI API (GPT-4o-mini) for customer support chat
- Email: Nodemailer with Gmail SMTP
- Package Manager: pnpm

================================================================================
PREREQUISITES
================================================================================
Before building and running the project, ensure you have the following installed:

1. Node.js (v18 or higher)
   Download from: https://nodejs.org/

2. pnpm (Package Manager)
   Install: npm install -g pnpm

3. MongoDB (v6.0 or higher)
   Download from: https://www.mongodb.com/try/download/community
   Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

4. Elasticsearch (v8.15.0) - Optional but recommended for search features
   Download from: https://www.elastic.co/downloads/elasticsearch
   Or use Docker: docker run -d -p 9200:9200 -e "discovery.type=single-node" 
   docker.elastic.co/elasticsearch/elasticsearch:8.15.0

5. Docker & Docker Compose (Optional - for containerized deployment)
   Download from: https://www.docker.com/get-started

================================================================================
INSTALLATION INSTRUCTIONS
================================================================================

STEP 1: Clone or Extract the Project
-------------------------------------
Extract the project to your desired location:
  cd /path/to/project/tranducbpo

STEP 2: Install Backend Dependencies
-------------------------------------
  cd my-backend
  pnpm install

STEP 3: Install Frontend Dependencies
-------------------------------------
  cd ../my-frontend
  pnpm install

STEP 4: Environment Configuration
---------------------------------
Create environment files for both backend and frontend:

A. Backend Environment (.env file in my-backend/ directory):
   
   # Database Configuration
   DATABASE_URI=mongodb://localhost:27017/tranducbpo
   # Or MongoDB Atlas:
   # DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/tranducbpo
   
   # Server Configuration
   PORT=3000
   JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3001
   
   # Email Configuration (Gmail SMTP)
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password_here
   # Note: Use App Password, not regular password
   # Generate at: https://myaccount.google.com/apppasswords
   
   # VNPay Configuration (Sandbox)
   VNPAY_TMNCODE=YOUR_VNPAY_TMNCODE
   VNPAY_HASH_SECRET=YOUR_VNPAY_HASH_SECRET
   VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/return
   VNPAY_FRONTEND_RESULT_URL=http://localhost:3001/payment/vnpay-result
   
   # Elasticsearch Configuration
   ELASTICSEARCH_URL=http://localhost:9200
   
   # OpenAI API (for AI Chat Assistant)
   OPENAI_API_KEY=sk-your_openai_api_key_here
   # Get API key from: https://platform.openai.com/api-keys

B. Frontend Environment (.env file in my-frontend/ directory):
   
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_OPENAI_KEY=sk-your_openai_api_key_here

STEP 5: MongoDB Setup
---------------------
1. Start MongoDB service:
   - Windows: net start MongoDB
   - macOS/Linux: sudo systemctl start mongod
   - Or use MongoDB Compass GUI

2. Verify connection:
   - Default: mongodb://localhost:27017
   - The database will be created automatically on first run

STEP 6: Elasticsearch Setup (Optional)
---------------------------------------
1. Start Elasticsearch:
   - Download and run: bin/elasticsearch
   - Or use Docker: docker run -d -p 9200:9200 -e "discovery.type=single-node" 
     docker.elastic.co/elasticsearch/elasticsearch:8.15.0

2. Verify: http://localhost:9200 should return JSON response

================================================================================
BUILDING & RUNNING THE APPLICATION
================================================================================

METHOD 1: Development Mode (Recommended for Testing)
----------------------------------------------------

Terminal 1 - Start Backend:
  cd my-backend
  pnpm run start
  # Server will run on http://localhost:3000

Terminal 2 - Start Frontend:
  cd my-frontend
  pnpm run start
  # Application will open at http://localhost:3001

METHOD 2: Production Build
---------------------------

Backend:
  cd my-backend
  pnpm build
  pnpm start:prod

Frontend:
  cd my-frontend
  pnpm build
  # Serve the 'build' folder with a static server
  # Example: npx serve -s build -l 3001

METHOD 3: Docker Compose (All Services)
----------------------------------------
  docker-compose up -d
  # Backend: http://localhost:3000
  # Frontend: http://localhost:3001
  # Elasticsearch: http://localhost:9200

================================================================================
TEST ACCOUNTS & LOGIN INFORMATION
================================================================================

ADMIN ACCOUNT (Pre-loaded):
----------------------------
Email: admin@tranducbpo.com
Password: admin123
Role: Admin
Access: Full admin dashboard at /admin

REGULAR USER ACCOUNT (Pre-loaded):
-----------------------------------
Email: user@example.com
Password: user123
Role: User
Access: Standard user features

Note: You can also register new accounts via the registration page at /register

================================================================================
APPLICATION URLS & ACCESS POINTS
================================================================================

Frontend Application:
  - Homepage: http://localhost:3001/home
  - Products: http://localhost:3001/products
  - Cart: http://localhost:3001/cart
  - Login: http://localhost:3001/login
  - Register: http://localhost:3001/register
  - Admin Dashboard: http://localhost:3001/admin (Admin only)

Backend API:
  - Base URL: http://localhost:3000
  - API Documentation: Check source code for endpoints
  - Health Check: http://localhost:3000 (GET)

Admin Panel Routes:
  - Dashboard: http://localhost:3001/admin
  - Products: http://localhost:3001/admin/product
  - Orders: http://localhost:3001/admin/order
  - Users: http://localhost:3001/admin/user
  - Discounts: http://localhost:3001/admin/discount

================================================================================
CORE FEATURES
================================================================================

1. USER AUTHENTICATION & AUTHORIZATION
   - JWT-based authentication
   - Google OAuth login
   - Password reset via email
   - Role-based access control (User/Admin)

2. PRODUCT MANAGEMENT
   - Product CRUD operations
   - Product image upload
   - Product search with Elasticsearch
   - Product filtering (price, brand, type)
   - Product reviews and ratings

3. SHOPPING CART
   - Add/remove items
   - Real-time cart updates via WebSocket
   - Persistent cart (localStorage + server sync)
   - Quantity management

4. ORDER PROCESSING
   - Order creation and tracking
   - Order history
   - Order status management

5. PAYMENT INTEGRATION
   - VNPay Sandbox integration
   - Credit card simulation
   - COD (Cash on Delivery)
   - Payment result handling

6. DISCOUNT SYSTEM
   - Discount code management
   - Percentage and fixed amount discounts
   - Discount validation

7. USER PROFILE
   - Profile management
   - Order history
   - Loyalty points system (10% of bill)
   - Favorites/wishlist

8. ADMIN DASHBOARD
   - Product management
   - Order management
   - User management
   - Discount code management
   - Statistics and analytics

================================================================================
OPTIONAL FEATURES (Extra Points)
================================================================================

1. AI-POWERED CUSTOMER SUPPORT CHAT
   - Location: Floating action button (bottom right)
   - Technology: OpenAI GPT-4o-mini
   - Features:
     * Real-time chat with AI assistant
     * Product recommendations
     * Shopping assistance in Vietnamese
     * Context-aware responses
   - Configuration: Set REACT_APP_OPENAI_KEY in frontend .env

2. REAL-TIME FEATURES WITH WEBSOCKET
   - Real-time cart synchronization
   - Live order updates
   - Instant notifications
   - Technology: Socket.IO

3. ADVANCED SEARCH WITH ELASTICSEARCH
   - Full-text product search
   - Fast search results
   - Search suggestions
   - Technology: Elasticsearch 8.15.0

4. EMAIL NOTIFICATIONS
   - Order confirmation emails
   - Password reset emails
   - Welcome emails
   - Technology: Nodemailer with Gmail SMTP

5. PRODUCT REVIEWS & RATINGS
   - User reviews with star ratings
   - Review display on product pages
   - Average rating calculation
   - Review moderation

6. IMAGE UPLOAD FOR PRODUCTS
   - Multiple image support
   - Image preview
   - Automatic image optimization
   - Static file serving

7. LOYALTY POINTS SYSTEM
   - Earn 10% of bill as points
   - Redeem points for discounts
   - Points history tracking

8. RESPONSIVE DESIGN
   - Mobile-first approach
   - Tablet optimization
   - Desktop experience
   - Technology: TailwindCSS

================================================================================
API ENDPOINTS (Key Endpoints)
================================================================================

Authentication:
  POST   /auth/login          - User login
  POST   /auth/register        - User registration
  POST   /auth/google          - Google OAuth
  GET    /auth/profile         - Get user profile

Products:
  GET    /product              - Get all products
  GET    /product/filter        - Filter products
  GET    /product/:id           - Get product details
  POST   /product              - Create product (Admin)
  PATCH  /product/:id           - Update product (Admin)
  DELETE /product/:id           - Delete product (Admin)
  POST   /product/:id/review    - Add product review
  GET    /product/:id/reviews  - Get product reviews

Cart:
  GET    /cart                 - Get user cart
  POST   /cart                 - Add to cart
  DELETE /cart/:id              - Remove from cart

Orders:
  POST   /order                - Create order
  GET    /order                - Get user orders
  GET    /order/:id             - Get order details

Payment:
  POST   /payment/vnpay/create - Create VNPay payment URL
  GET    /payment/vnpay/return  - VNPay callback handler

Discount:
  GET    /discount/code/:code   - Validate discount code

Admin:
  GET    /admin/products        - Admin: Get all products
  GET    /admin/orders          - Admin: Get all orders
  GET    /admin/users           - Admin: Get all users

================================================================================
PROJECT STRUCTURE
================================================================================

tranducbpo/
├── my-backend/              # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── user/           # User management
│   │   ├── product/        # Product management
│   │   ├── cart/           # Shopping cart
│   │   ├── order/          # Order processing
│   │   ├── payment/        # Payment integration
│   │   ├── discount/       # Discount codes
│   │   ├── mail/           # Email service
│   │   ├── websocket/      # Real-time features
│   │   ├── elasticsearch/  # Search functionality
│   │   └── ai/             # AI chat integration
│   ├── uploads/            # Uploaded files (images)
│   └── .env                # Environment variables
│
├── my-frontend/            # React Frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   │   ├── Admin/      # Admin dashboard pages
│   │   │   ├── Auth/       # Authentication pages
│   │   │   ├── Cart/       # Shopping cart
│   │   │   ├── Payment/    # Payment pages
│   │   │   └── ...
│   │   ├── components/     # Reusable components
│   │   ├── api/           # API configuration
│   │   ├── auth/          # Auth context
│   │   └── utils/         # Utility functions
│   └── .env               # Frontend environment variables
│
├── docker-compose.yml      # Docker configuration
└── README.txt             # This file

================================================================================
TROUBLESHOOTING
================================================================================

Issue: "Cannot connect to MongoDB"
Solution: 
  - Ensure MongoDB is running
  - Check DATABASE_URI in .env
  - Verify MongoDB port (default: 27017)

Issue: "VNPay chưa được cấu hình đầy đủ"
Solution:
  - Add all VNPAY_* variables to backend .env
  - Restart backend server
  - Verify VNPay credentials are correct

Issue: "Elasticsearch connection failed"
Solution:
  - Start Elasticsearch service
  - Check ELASTICSEARCH_URL in .env
  - Verify port 9200 is accessible

Issue: "OpenAI API error"
Solution:
  - Set REACT_APP_OPENAI_KEY in frontend .env
  - Verify API key is valid
  - Check API quota/balance

Issue: "Email not sending"
Solution:
  - Use Gmail App Password (not regular password)
  - Enable "Less secure app access" or use App Password
  - Verify GMAIL_USER and GMAIL_PASS in .env

Issue: "Port already in use"
Solution:
  - Change PORT in backend .env
  - Or kill process using the port:
    Windows: netstat -ano | findstr :3000
    macOS/Linux: lsof -ti:3000 | xargs kill

Issue: "CORS errors"
Solution:
  - Verify FRONTEND_URL in backend .env matches frontend URL
  - Check CORS configuration in main.ts

================================================================================
TESTING THE APPLICATION
================================================================================

1. User Registration & Login:
   - Go to http://localhost:3001/register
   - Create a new account
   - Login at http://localhost:3001/login

2. Browse Products:
   - Visit http://localhost:3001/home
   - Use search and filters
   - Click on products to view details

3. Shopping Cart:
   - Add products to cart
   - View cart at http://localhost:3001/cart
   - Modify quantities

4. Checkout & Payment:
   - Proceed to payment page
   - Apply discount codes (if available)
   - Test VNPay payment (sandbox mode)
   - Complete order

5. Admin Features:
   - Login as admin (admin@tranducbpo.com / admin123)
   - Access admin panel at http://localhost:3001/admin
   - Manage products, orders, users, discounts

6. AI Chat:
   - Click the floating chat button (bottom right)
   - Ask questions about products
   - Get shopping assistance

7. Product Reviews:
   - View product details
   - Scroll to reviews section
   - Add your own review and rating

================================================================================
NOTES FOR EVALUATORS
================================================================================

1. Database: MongoDB will auto-create collections on first run. No manual 
   database setup required.

2. Sample Data: The application starts with empty database. Use admin panel to 
   add products, or register new users to test features.

3. VNPay Sandbox: Payment integration uses VNPay sandbox. Real transactions 
   will not be processed. Use test credentials provided by VNPay.

4. Elasticsearch: Search features work best with Elasticsearch running. 
   Without it, basic MongoDB search will be used.

5. AI Chat: Requires valid OpenAI API key. Without it, chat feature will show 
   a configuration message.

6. Email: Email features require Gmail SMTP configuration. Without it, email 
   sending will fail silently.

7. Real-time Features: WebSocket features require both frontend and backend 
   running simultaneously.

8. Image Upload: Product images are stored in my-backend/uploads/products/
   directory. Ensure write permissions.

9. Environment Variables: All sensitive data should be in .env files (not 
   committed to version control).

10. Ports: Default ports are 3000 (backend) and 3001 (frontend). Change if 
    conflicts occur.

================================================================================
DEVELOPMENT COMMANDS
================================================================================

Backend:
  pnpm start:dev    - Start in development mode with hot reload
  pnpm build        - Build for production
  pnpm start:prod   - Start production server
  pnpm test         - Run tests
  pnpm lint         - Lint code

Frontend:
  pnpm start        - Start development server
  pnpm build        - Build for production
  pnpm test         - Run tests

================================================================================
CONTACT & SUPPORT
================================================================================

For issues or questions during evaluation:
- Check the troubleshooting section above
- Review environment variable configuration
- Verify all services are running (MongoDB, Elasticsearch)
- Check console logs for detailed error messages

================================================================================
END OF DOCUMENTATION
================================================================================



Account: longh@gmail.com/huhu (admin)
