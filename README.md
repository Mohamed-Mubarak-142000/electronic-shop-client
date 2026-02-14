# 🛒 Electro-Shop - Full-Featured E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 16 and React 19, designed for electronic products with comprehensive admin management, real-time chat support, multi-language capabilities, and advanced analytics.

## 🚀 Live Demo

**[View Live Project](#)** _(Add your deployment link here)_

**[Backend Repository](#)** _(Add your backend repository link here)_

---

## 📋 Project Overview

Electro-Shop is a sophisticated e-commerce solution that provides a seamless shopping experience for customers while offering powerful management tools for administrators. The platform features a responsive design, real-time communication, multi-currency support, and internationalization, making it suitable for global markets.

**Key Highlights:**
- Built with the latest Next.js 16 (App Router) and React 19
- Real-time chat system using Socket.IO
- Comprehensive admin dashboard with analytics
- Multi-language support (English/Arabic with RTL)
- Advanced order management and tracking
- PDF invoice generation
- Interactive maps for location services
- Discount scheduling system
- Mobile-responsive design with dark theme

---

## ✨ Features

### 🛍️ Customer Features
- **User Authentication & Authorization**
  - User registration with email verification (OTP)
  - Business account registration
  - Secure login system
  - Password recovery with OTP verification
  - JWT-based authentication

- **Product Browsing & Discovery**
  - Advanced product catalog with filtering and search
  - Category and brand-based navigation
  - Product details with image galleries
  - Related products recommendations
  - Hero slider/carousel for featured products
  - Testimonials section

- **Shopping Experience**
  - Shopping cart with persistent state
  - Wishlist functionality
  - Multi-currency support (USD and others)
  - Real-time stock status indicators
  - Product availability alerts
  
- **Checkout & Orders**
  - Streamlined checkout process
  - Multiple payment method options (Vodafone Cash, Instapay, Credit Card)
  - Order tracking system
  - Order history and status updates
  - PDF invoice generation
  - Interactive maps for address selection (Mapbox)

- **Communication**
  - Real-time chat with admin support
  - Contact forms
  - FAQ section
  - Support page

- **User Account**
  - Profile management
  - Order history
  - Address management with map integration
  - Wishlist management

- **Additional Pages**
  - About Us
  - Portfolio/Projects showcase
  - Installation services information
  - Terms & Conditions
  - Privacy Policy
  - Returns & Refunds
  - Sitemap

### 🎛️ Admin Features
- **Dashboard & Analytics**
  - Real-time statistics and KPIs
  - Revenue charts and trends
  - Order status visualization
  - Low stock alerts
  - Recent orders overview

- **Product Management**
  - Complete CRUD operations for products
  - Bulk product uploads
  - Image management with Cloudinary integration
  - Stock level tracking
  - Product variants support
  - Discount scheduling system

- **Category & Brand Management**
  - Create, edit, and delete categories
  - Brand management
  - Category slider configuration

- **Order Management**
  - View all orders with filters and pagination
  - Order status updates
  - Mark orders as paid/delivered
  - Order details drawer
  - Customer order history

- **Customer Management**
  - View all registered customers
  - Customer details and order history
  - User role management

- **Job Postings**
  - Create and manage job listings
  - Job applications tracking

- **Portfolio Management**
  - Showcase completed projects
  - Project CRUD operations

- **Communication Center**
  - Real-time chat interface
  - Conversation management
  - Unread message notifications
  - Chat history

- **Scheduling System**
  - Discount scheduling (percentage or fixed amount)
  - Automated price updates
  - Schedule cancellation

- **Settings & Configuration**
  - Global site settings
  - Language preferences
  - Currency settings
  - Payment method configuration
  - Tax and shipping rates
  - Image upload limits

### 🌐 Technical Features
- **Internationalization (i18n)**
  - Multi-language support (English/Arabic)
  - RTL (Right-to-Left) layout for Arabic
  - Language persistence across sessions

- **Performance Optimizations**
  - Server-side rendering (SSR)
  - Lazy loading for components
  - Image optimization with Next.js Image
  - Code splitting
  - Font optimization with swap strategy

- **State Management**
  - Zustand for global state
  - Persistent state with localStorage
  - React Query for server state caching

- **Real-Time Features**
  - Socket.IO integration for live chat
  - Real-time notifications
  - Live order updates

- **UI/UX**
  - Fully responsive design
  - Dark theme with centralized color system
  - Smooth animations with Framer Motion
  - Interactive carousels with Swiper
  - Toast notifications
  - Loading states and skeletons

---

## 🛠️ Technologies Used

### Frontend Framework & Core
- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5** - Type safety and developer experience

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Class Variance Authority** - CSS variant management

### State Management & Data Fetching
- **Zustand 5.0** - Lightweight state management
- **TanStack React Query 5.90** - Server state management & caching
- **Axios 1.13** - HTTP client

### Forms & Validation
- **React Hook Form 7.68** - Form state management
- **Zod 4.1** - Schema validation
- **@hookform/resolvers** - Form validation resolver

### Real-Time & Communication
- **Socket.IO Client 4.8** - Real-time bidirectional communication

### Internationalization
- **i18next 25.7** - Internationalization framework
- **react-i18next 16.5** - React integration for i18next
- **i18next-browser-languagedetector** - Language detection

### Maps & Location
- **Mapbox GL 3.17** - Interactive maps
- **React Map GL 8.1** - React wrapper for Mapbox

### PDFs & Documents
- **PDFMake 0.3** - PDF document generation

### UI Components & Utilities
- **Swiper 12.0** - Modern mobile touch slider
- **React Hot Toast 2.6** - Notifications
- **date-fns 4.1** - Modern date utility library
- **Lodash 4.17** - Utility functions
- **clsx & tailwind-merge** - Class name utilities

### Development Tools
- **ESLint 9** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

### Deployment & Hosting
- **Vercel** - Deployment platform
- **Cloudinary** - Image hosting & CDN
- **MongoDB Atlas** - Database hosting

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URLs
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-api.vercel.app

# Mapbox (for interactive maps)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

**For Production** (`.env.production`):
```env
NEXT_PUBLIC_API_URL=https://your-production-backend.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-production-backend.vercel.app
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 💻 Usage

### Running the Project Locally

1. **Start the backend server** (ensure your backend is running)
2. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
3. **Access the application**:
   - Customer site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`

### Admin Access

To access the admin dashboard, you'll need admin credentials from your backend authentication system.

### Customizing Theme

The project uses a centralized theme system. To change colors:

1. Open [src/app/globals.css](src/app/globals.css)
2. Modify CSS variables in the `:root` section
3. Changes apply automatically across the entire app

See [THEME_SYSTEM.md](THEME_SYSTEM.md) for detailed customization guide.

---

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (public)/          # Public customer routes
│   │   ├── admin/             # Admin dashboard routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles & theme
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── cart/              # Shopping cart components
│   │   ├── chat/              # Chat components
│   │   ├── home/              # Homepage components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Reusable components
│   │   └── ui/                # Shadcn UI components
│   ├── services/              # API service layers
│   ├── store/                 # Zustand state stores
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript type definitions
│   └── locales/               # Translation files
├── public/                    # Static assets
└── package.json               # Dependencies & scripts
```

---

## 🌟 Key Achievements

- ✅ Built a fully functional e-commerce platform from scratch
- ✅ Implemented real-time chat using WebSocket technology
- ✅ Developed a comprehensive admin dashboard with analytics
- ✅ Achieved full internationalization with RTL support
- ✅ Integrated multiple third-party services (Mapbox, Cloudinary)
- ✅ Optimized performance with Next.js 16 features
- ✅ Created a reusable component library with Shadcn UI
- ✅ Implemented secure authentication with JWT
- ✅ Built responsive design supporting all device sizes
- ✅ Integrated payment gateway configurations

---

## 🔮 Future Improvements

- [ ] Add more payment gateway integrations (Stripe, PayPal)
- [ ] Implement product reviews and ratings
- [ ] Add social media authentication (Google, Facebook)
- [ ] Enhance analytics with detailed user behavior tracking
- [ ] Add product recommendations using AI/ML
- [ ] Implement push notifications for order updates
- [ ] Add bulk import/export functionality for products
- [ ] Create a mobile app version (React Native)
- [ ] Implement advanced search with filters and facets
- [ ] Add multi-vendor support

---

## 📸 Screenshots

_Add your application screenshots here to showcase the UI_

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mohamed Mubarak**

- LinkedIn: [Your LinkedIn Profile](#)
- GitHub: [Your GitHub Profile](#)
- Portfolio: [Your Portfolio](#)

---

## 📞 Contact

For any inquiries or support, please contact:
- Email: your.email@example.com
- Website: [Your Website](#)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- Shadcn for the beautiful UI components
- All open-source contributors

---

**⭐ If you found this project helpful, please give it a star!**

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
client/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   ├── providers/     # Context providers
│   ├── services/      # API services
│   ├── store/         # Zustand stores
│   └── types/         # TypeScript types
├── public/            # Static assets
└── package.json
```

## Features

- Server-side rendering with Next.js
- Responsive design with Tailwind CSS
- Real-time chat with Socket.IO
- Multi-language support (Arabic & English)
- Shopping cart and wishlist
- Product search and filtering
- User authentication
- Admin dashboard
- Order management
- Invoice generation

## License

ISC
