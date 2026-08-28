# KASUT 🏡

**A full-stack vacation rental marketplace** — built from scratch with Node.js, Express, MongoDB, and EJS. Features a complete booking system with conflict detection, role-based authorization, Cloudinary image storage, and a polished Airbnb-inspired UI.

---

## Live Demo
> *Coming soon — deploying to AWS*

---

## Features

### Core
- 🔐 **User Authentication** — Sign up, log in, log out via Passport.js (local strategy)
- 🏠 **Listing CRUD** — Create, read, update, delete vacation listings with Cloudinary image uploads
- ⭐ **Review System** — Star ratings (1–5) with interactive picker, average score display, and per-review author + date
- 📅 **Booking & Availability Calendar** — Interactive 2-month calendar showing available and booked dates with click-to-select, date conflict prevention, and total price calculator
- 👤 **User Profile** — Tabbed view of all your listings and booking history (upcoming + past stays)

### Discovery
- 🔍 **Search & Multi-Filter** — Search by title, location, or country, combined with minimum and maximum price range filters
- 🗂 **12-Category Filter** — Beaches, Mountains, Castles, Farms, Arctic, Camping, Iconic Cities, Treehouses, Lakefront, Desert, Luxury, Tropical
- 💰 **Tax Toggle** — Show price before or after 18% tax

### Security & Reliability
- 🔒 **Role-based Authorization** — `isOwner`, `isReviewAuthor`, `isBookingGuest` middleware guards
- ✅ **Joi Validation** — Server-side validation on all listing and review inputs
- 🛡 **Cascade Deletes** — Reviews and bookings auto-delete when a listing is removed
- 💾 **MongoStore Sessions** — Persistent sessions stored in MongoDB, not in-memory

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Auth | Passport.js (passport-local-mongoose) |
| Templating | EJS + ejs-mate |
| Image Storage | Cloudinary + Multer |
| Session Store | connect-mongo |
| Validation | Joi |
| Styling | Bootstrap 5 + Vanilla CSS |
| Hosting | AWS (MongoDB Atlas) |

---

## Architecture

```
KASUT/
├── app.js                  # Express app + middleware + routes
├── cloudConfig.js          # Cloudinary + Multer config
├── middleware.js           # Auth + validation + authorization guards
├── schema_joi.js           # Joi schemas for listing and review
├── models/
│   ├── listing.js          # Listing schema (with cascade delete)
│   ├── reviews.js          # Review schema
│   ├── booking.js          # Booking schema
│   └── user.js             # User schema (passport-local-mongoose)
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   ├── bookings.js         # Booking + profile logic
│   └── users.js            # Auth logic
├── routes/
│   ├── listing.js
│   ├── review.js
│   ├── booking.js
│   └── user.js
├── views/
│   ├── listings/           # Index, show, new, edit, error, landing
│   ├── users/              # Login, signup, profile
│   ├── includes/           # Navbar, footer
│   └── layouts-ejs_mate/   # Boilerplate layout
├── public/
│   ├── css/style.css
│   └── js/script.js
└── init/                   # Sample data seeding
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/dev20082012-spec/KASUT.git
cd KASUT

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your values in .env

# 4. (Optional) Seed sample data
node init/index.js

# 5. Start the server
npm start          # production
npm run dev        # development (nodemon)
```

Open `http://localhost:8080` in your browser.

---

## Environment Variables

```env
CLOUD_NAME=           # Cloudinary cloud name
CLOUD_API_KEY=        # Cloudinary API key
CLOUD_API_SECRET=     # Cloudinary API secret
SECRET=               # Session secret (use a long random string)
MONGO_URL=            # MongoDB connection string (Atlas recommended)
```

---

## Key Implementation Details

**Booking Conflict Detection** — On both the client (JS checks `window.__bookedRanges` before submit) and server (`Booking.find()` overlap check using `checkIn < b.checkOut && checkOut > b.checkIn`).

**Authorization Middleware** — Every sensitive route goes through the appropriate guard: `isLoggedIn` → `isOwner`/`isReviewAuthor`/`isBookingGuest`. No action can be performed without ownership verification.

**Cascade Deletes** — Mongoose post-hook on `findOneAndDelete` removes all associated reviews and bookings when a listing is deleted.

**Image Handling** — Multer streams uploads directly to Cloudinary without saving to disk. Edit form shows a Cloudinary-transformed thumbnail (`/upload/w_250/`).

---

## License

MIT
