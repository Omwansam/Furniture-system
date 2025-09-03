# Furniture System - E-commerce Platform

A modern, full-stack e-commerce platform for furniture sales built with React frontend and Flask backend. This system provides a complete solution for managing furniture products, orders, payments, and customer interactions.

## 🏠 Project Overview

The Furniture System is a comprehensive e-commerce platform that enables users to browse, purchase, and manage furniture products. It includes features for both customers and administrators, with integrated payment processing, order management, and analytics.

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: Browse furniture by categories with detailed product information
- **Shopping Cart**: Add/remove items, manage quantities, and save for later
- **User Authentication**: Secure registration and login system
- **Order Management**: Track order status, view order history
- **Payment Processing**: Multiple payment methods including Stripe integration
- **Product Reviews**: Read and write product reviews and ratings
- **Wishlist**: Save favorite products for future purchase
- **Search & Filter**: Advanced product search and filtering capabilities
- **Best Sellers**: View trending and popular products

### 👨‍💼 Admin Features
- **Product Management**: Add, edit, and delete products with image uploads
- **Category Management**: Organize products into categories
- **Order Management**: Process orders, update status, and manage inventory
- **User Management**: View and manage customer accounts
- **Analytics Dashboard**: Sales reports, user analytics, and performance metrics
- **Blog Management**: Create and manage blog posts
- **Social Media Integration**: Manage social media links and content

### 💳 Payment & Billing
- **Stripe Integration**: Secure payment processing
- **MPESA Integration**: Mobile money payments (Kenya)
- **Multiple Payment Methods**: Credit cards, mobile payments, etc.
- **Invoice Generation**: Automated billing and invoice creation
- **Refund Management**: Process refunds and handle returns

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLAlchemy with SQLite/PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API, MPESA API
- **File Upload**: Static file serving
- **CORS**: Cross-origin resource sharing enabled

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Charts**: Recharts for analytics
- **Styling**: CSS with modern design

### Development Tools
- **Package Manager**: Pipenv (Python), npm (Node.js)
- **Linting**: ESLint
- **Version Control**: Git

## 📁 Project Structure

```
Furniture-system/
├── BACKEND/
│   ├── server/
│   │   ├── app.py                 # Main Flask application
│   │   ├── models.py              # Database models
│   │   ├── config.py              # Configuration settings
│   │   ├── extensions.py          # Flask extensions
│   │   ├── routes/                # API route handlers
│   │   ├── static/                # Static files and uploads
│   │   ├── migrations/            # Database migrations
│   │   └── utils/                 # Utility functions
│   ├── Pipfile                    # Python dependencies
│   └── test_*.py                  # Backend test files
├── FRONTEND/
│   └── vitrax-limited/
│       ├── src/
│       │   ├── components/        # React components
│       │   ├── pages/             # Page components
│       │   ├── services/          # API services
│       │   ├── context/           # React context
│       │   └── utils/             # Utility functions
│       ├── public/                # Static assets
│       └── package.json           # Node.js dependencies
├── SETUP_GUIDE.md                 # Setup instructions
├── MPESA_SETUP.md                 # MPESA integration guide
├── STRIPE_SETUP.md                # Stripe integration guide
└── LICENSE                        # MIT License
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Furniture-system
   ```

2. **Set up Python environment**
   ```bash
   cd BACKEND
   pip install pipenv
   pipenv install
   pipenv shell
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in BACKEND/server/
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   cd server
   python seed.py
   ```

5. **Start the backend server**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd FRONTEND/vitrax-limited
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `BACKEND/server/` with the following variables:

```env
# Database
DATABASE_URL=sqlite:///furniture_system.db

# JWT Secret
JWT_SECRET_KEY=your-secret-key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# MPESA Configuration (if using)
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get product by ID
- `GET /api/bestsellers` - Get best-selling products
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/<id>` - Update product (Admin)
- `DELETE /api/products/<id>` - Delete product (Admin)

### Category Endpoints
- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin)
- `PUT /categories/<id>` - Update category (Admin)

### Order Endpoints
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `PUT /orders/<id>` - Update order status (Admin)

### Cart Endpoints
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove/<id>` - Remove item from cart

### Payment Endpoints
- `POST /payments/create` - Create payment intent
- `POST /stripe/webhook` - Stripe webhook handler
- `POST /payments/confirm` - Confirm payment

## 🧪 Testing

### Backend Tests
```bash
cd BACKEND
pipenv run python test_api.py
pipenv run python test_admin_api.py
```

### Frontend Tests
```bash
cd FRONTEND/vitrax-limited
npm run test
```

## 📊 Database Schema

The system includes the following main entities:
- **Users**: Customer and admin accounts
- **Products**: Furniture items with images and descriptions
- **Categories**: Product categorization
- **Orders**: Customer orders with status tracking
- **OrderItems**: Individual items in orders
- **Reviews**: Product reviews and ratings
- **ShoppingCart**: User shopping cart items
- **Payments**: Payment transactions
- **Blog**: Blog posts and articles
- **SocialMedia**: Social media links and content

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- CORS protection
- Input validation
- SQL injection prevention
- Secure payment processing

## 🚀 Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables for production
3. Use a WSGI server like Gunicorn
4. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to a static hosting service (Netlify, Vercel, etc.)
3. Configure environment variables for production API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the setup guides in the documentation
- Review the test files for usage examples

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce features
- **v1.1.0** - Added admin dashboard and analytics
- **v1.2.0** - Integrated Stripe and MPESA payments
- **v1.3.0** - Added blog and social media features

---

**Built with ❤️ by Omwansam**