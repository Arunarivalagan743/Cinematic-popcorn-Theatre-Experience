# 🎬 Cinematic Popcorn Theatre Experience

[![Live Demo](https://img.shields.io/badge/Live-cinexp.app-ff69b4)](https://www.cinexp.app)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Server-Express-lightgrey)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black)](https://socket.io/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com/)

## 🌟 Overview

Cinematic Popcorn is a comprehensive movie theatre booking platform that allows users to browse movies, book seats, reserve parking, and make secure payments. The platform features real-time seat selection, user authentication, and a powerful admin dashboard.

**Live at: [https://www.cinexp.app](https://www.cinexp.app)**

![Cinematic Popcorn Theatre](./client/public/mov.jpg)

## ✨ Features

### 🎟️ For Users
- Browse movies with detailed information including cast, language, genre, and ratings
- View available showtimes and select preferred viewing slots
- Real-time seat selection with visual interface
- Optional parking slot reservation
- Secure payment processing with Stripe
- User profile management with booking history
- Email confirmations for bookings
- OAuth authentication with multiple providers
- Mobile responsive design

### 👑 For Administrators
- Comprehensive dashboard with analytics and metrics
- Movie management (add, edit, delete)
- Showtime scheduling with automatic daily generation
- Seat and parking inventory management
- Booking oversight and management
- User management with role-based access control
- Reports and analytics
- Customer support message handling
- FAQ management

## 🛠️ Technologies

### Frontend
- React 18
- Redux Toolkit (state management)
- React Router (navigation)
- Socket.IO Client (real-time updates)
- Stripe Integration (payments)
- Tailwind CSS (styling)
- Vite (build tool)
- Firebase (OAuth authentication)
- React Toastify (notifications)
- FontAwesome & React Icons (UI elements)
- SweetAlert2 (enhanced alerts)
- Recharts (data visualization)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (authentication)
- Socket.IO (real-time communication)
- bcrypt (password hashing)
- Stripe API (payment processing)
- Node-cron (scheduled tasks)
- Express Validator (input validation)
- Cors (cross-origin resource sharing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arunarivalagan743/Cinematic-popcorn-Theatre-Experience.git
   cd mern-auth
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install API dependencies
   cd ../api
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Create a `.env` file in the `client` directory
   - Set the required variables (see Environment Variables section below)

4. **Start the application using the batch file**
   ```bash
   # From the root directory
   start-app.bat
   ```
   
   Or manually start the servers:
   ```bash
   # Start API server (from api directory)
   npm run dev
   
   # Start client (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 🔒 Environment Variables

### API (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

### Client (.env)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 📱 Mobile Compatibility

The application is fully responsive and optimized for mobile devices, providing a seamless experience across all screen sizes.

## 🔐 Admin Access

For admin access, please refer to the [Admin Guide](./ADMIN_GUIDE.md) for detailed instructions on accessing and using the admin panel.

Default Admin Credentials:
- **Email:** admin@cinexp.com
- **Password:** CinAdmin2024!

## 🌐 Deployment

The application is deployed using Vercel:
- Frontend: [https://www.cinexp.app](https://www.cinexp.app)
- Backend: Serverless functions deployed on Vercel
- Domain: cinexp.app (registered with name.com)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Arunarivalagan743](https://github.com/Arunarivalagan743)

