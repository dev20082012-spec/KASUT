# KASUT 🏡

[![Live Demo](https://img.shields.io/badge/Live_Demo-kasut.onrender.com-brightgreen?style=for-the-badge&logo=render)](https://kasut.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Storage-blue?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

**A full-stack vacation rental marketplace** — built from scratch with Node.js, Express, MongoDB Atlas, and EJS. Features a complete booking system with double-booking conflict detection, role-based authorization, interactive star ratings, Cloudinary cloud image storage, and a polished Airbnb-inspired responsive UI.

---

## 🌐 Live Demo
🔗 **[https://kasut.onrender.com/](https://kasut.onrender.com/)**

Explore listings, test search & multi-filtering, check out the interactive availability calendar, sign up, leave ratings & reviews, and book stays in real time!

---

## ✨ Features

### Core Features
- 🔐 **User Authentication** — Sign up, log in, log out via Passport.js (PBKDF2 salted hash password storage)
- 🏠 **Listing Management (CRUD)** — Create, view, edit, and delete accommodation listings with Cloudinary multipart uploads and automatic image optimization
- ⭐ **Interactive Review & Rating System** — Dynamic 5-star picker, automated average rating aggregation, review timestamps, and author avatars
- 📅 **Visual Availability Calendar & Booking** — Interactive 2-month calendar color-coding available vs. booked dates with click-to-select, client/server overlap prevention, and live price calculation
- 👤 **User Profile Dashboard** — Dedicated `/profile` route with tabbed view of your hosted listings, upcoming bookings, and past stay history with cancellation support

### Discovery & UX
- 🔍 **Search & Multi-Criteria Filtering** — Search destinations by city, country, or keyword, combined with min/max price range filters
- 🗂 **12 Category Filters** — Beaches, Mountains, Castles, Farms, Arctic, Camping, Iconic Cities, Treehouses, Lakefront, Desert, Luxury, Tropical
- 💰 **Live Tax Toggle** — Seamlessly toggle 18% tax calculations on all listing prices

### Security & Production Infrastructure
- 🔒 **3-Layer Role-Based Authorization** — `isLoggedIn`, `isOwner`, `isReviewAuthor`, and `isBookingGuest` guards
- ✅ **Joi Schema Validation** — Server-side payload validation on all listing and review submissions
- 🛡 **Mongoose Cascade Deletes** — Post-hooks ensure reviews and bookings are deleted when a listing is removed
- 💾 **Persistent Session Storage** — MongoDB Atlas-backed `connect-mongo` session store with encrypted cookies
- ☁️ **Cloudinary Integration** — Direct media streaming with automatic thumbnails (`/upload/w_250/`)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (v18+) |
| **Backend Framework** | Express.js v5 |
| **Database** | MongoDB Atlas (Cloud) + Mongoose ODM |
| **Authentication** | Passport.js + passport-local-mongoose |
| **Templating Engine** | EJS + ejs-mate |
| **Media Storage** | Cloudinary API + Multer Storage |
| **Session Management** | express-session + connect-mongo |
| **Input Validation** | Joi |
| **Frontend Styling** | Bootstrap 5 + Vanilla CSS + Font Awesome |
| **Deployment** | Render (Web Service) |

---

## 📁 Architecture

```
KASUT/
├── app.js                  # Express setup, middleware & route mount points
├── cloudConfig.js          # Cloudinary SDK & Multer storage configuration
├── middleware.js           # Authentication & role-based authorization guards
├── schema_joi.js           # Joi validation schemas
├── models/
│   ├── listing.js          # Listing schema with cascade-delete hooks
│   ├── reviews.js          # Review schema
│   ├── booking.js          # Booking schema with date ranges & guest refs
│   └── user.js             # User schema with passport-local-mongoose
├── controllers/
│   ├── listings.js         # Listing CRUD & search/filter logic
│   ├── reviews.js          # Review creation & deletion logic
│   ├── bookings.js         # Booking reservation, cancellation & profile
│   └── users.js            # User signup, login & session logic
├── routes/
│   ├── listing.js          # /listings routes
│   ├── review.js           # /listings/:id/reviews routes
│   ├── booking.js          # /listings/:id/bookings routes
│   └── user.js             # Auth & /profile routes
├── views/
│   ├── listings/           # Index, show, new, edit, error, landing
│   ├── users/              # Login, signup, profile dashboard
│   ├── includes/           # Navbar, footer
│   └── layouts-ejs_mate/   # Master boilerplate layout
├── public/
│   ├── css/style.css       # Custom design system & animations
│   └── js/script.js        # Star picker, calendar engine & UI logic
└── init/                   # Sample data seeding script for Atlas
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/dev20082012-spec/KASUT.git
cd KASUT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
SECRET=your_session_secret_key

# Option A: MongoDB Atlas (Cloud)
ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/KASUT?retryWrites=true&w=majority

# Option B: Local MongoDB (Default fallback if ATLASDB_URL is omitted)
# MONGO_URL=mongodb://127.0.0.1:27017/KASUT
```

*(Note: If no database URL is supplied in `.env`, the application automatically defaults to your local MongoDB server at `mongodb://127.0.0.1:27017/KASUT`).*

### 4. Seed sample listings (Optional)
```bash
node init/index.js
```

### 5. Start the application
```bash
npm start          # Production start
npm run dev        # Development with nodemon
```
Open `http://localhost:8080` in your browser.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
