# 🏨 Hotel Management System - HotelManagement Project

## 📖 Overview

A comprehensive **Hotel Management System** built with modern web technologies. This full-stack application provides a complete solution for hotel booking management, featuring separate interfaces for administrators and customers, real-time room availability, integrated payment processing, and advanced analytics.

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- Multi-role authentication (Admin/Staff/Customer)
- JWT-based secure login system
- Password reset via email verification
- Role-based access control (RBAC)

### 🏨 **Hotel Management**
- Multi-hotel management system
- CRUD operations for hotels, rooms, and amenities
- Real-time room availability tracking
- Image upload and management with Cloudinary

### 📅 **Booking System**
- Advanced room search with filters (date, location, guests)
- Real-time availability checking
- Booking history and management
- Automated booking confirmations

### 💳 **Payment Integration**
- VNPay payment gateway integration
- Secure transaction processing
- Payment history and refund management
- Automated payment notifications

### 📊 **Analytics Dashboard**
- Revenue analytics with interactive charts
- Booking statistics and trends
- Customer registration metrics
- Hotel performance comparison

### ⭐ **Review System**
- Customer rating and review system
- Review moderation for administrators
- Rating aggregation and display

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT, bcryptjs
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Payment:** VNPay SDK

### **Frontend**
- **Framework:** React.js 18
- **Build Tool:** Vite
- **UI Library:** Ant Design
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Styling:** Sass/SCSS
- **HTTP Client:** Axios

### **Development Tools**
- **Transpiler:** Babel
- **Linting:** ESLint
- **Version Control:** Git
- **Process Manager:** Nodemon

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Quyenanh493/HotelManagement
```

2. **Backend Setup**
```bash
cd Back-End

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env
# DB_HOST=localhost
# DB_USER=your_db_user
# DB_PASS=your_db_password
# DB_NAME=hotel_management_db
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# VNPAY_TMN_CODE=your_vnpay_code
# VNPAY_HASH_SECRET=your_vnpay_secret

# Create database
npx sequelize-cli db:create

# Run migrations
npx sequelize-cli db:migrate

# Seed database (optional)
npx sequelize-cli db:seed:all

# Start development server
npm start
```

3. **Admin Frontend Setup**
```bash
cd Front-End/admin-QLKS

# Install dependencies
npm install

# Start development server
npm run dev
```

4. **Customer Frontend Setup**
```bash
cd Front-End/customer-QLKS

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Access Points**
- **Backend API:** http://localhost:8080
- **Admin Panel:** http://localhost:5173
- **Customer Portal:** http://localhost:3000

## 📁 Project Structure
