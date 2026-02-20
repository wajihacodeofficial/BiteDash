# 🍔 BiteDash | Premium Food Delivery Karachi

BiteDash is a high-performance, full-stack food delivery platform tailored specifically for the culinary landscape of Karachi. Built with the MERN stack, it offers a seamless experience for customers to browse, order, and track their favorite meals from the city's top restaurants.

![BiteDash Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80)

## 🚀 Key Features

- **Premium UI/UX:** A modern, cinematically inspired interface built with React and Framer Motion.
- **Real-time Tracking:** Live order updates via Socket.io.
- **Dynamic Restaurant Discovery:** Search and filter restaurants by cuisine, rating, and delivery time.
- **Geo-location Integration:** Finds nearby restaurants based on your current location in Karachi.
- **Secure Authentication:** JWT-based authentication for customers, riders, and admins.
- **Comprehensive Admin Portal:** Manage restaurants, orders, and users efficiently.
- **Rider Dashboard:** Specialized interface for riders to manage deliveries.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.

## 🛠 Tech Stack

**Frontend:**

- **React 19:** State-of-the-art UI library.
- **Vite:** Next-generation frontend tooling.
- **Framer Motion:** High-end animations and transitions.
- **Lucide React:** Beautiful, consistent iconography.
- **Axios:** For robust API communications.
- **Socket.io-client:** Real-time bi-directional communication.

**Backend:**

- **Node.js & Express 5:** Fast and scalable backend infrastructure.
- **MongoDB & Mongoose:** Flexible and powerful NoSQL data modeling.
- **JWT:** Secure token-based authentication.
- **Bcrypt.js:** Industry-standard password hashing.
- **Socket.io:** Real-time event-based communication.

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Running locally or on Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/wajihacodeofficial/BiteDash.git
cd BiteDash
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bitedash
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### 4. Seed Database (Optional)

To populate the database with Karachi-specific restaurant data:

```bash
cd ../backend
node seed.js
```

## 🚦 Running the Application

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🤝 Developed By

This project is developed and maintained by **RapidWave Software**.

---

© 2025 BiteDash. Exclusively for the food lovers of Karachi.
