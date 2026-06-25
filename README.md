# ReWear ♻️ - P2P Sustainable Fashion Swap Platform

ReWear is a premium, full-stack peer-to-peer sustainable fashion swapping platform designed to encourage a circular economy, reduce textile waste, and make eco-friendly wardrobe updates fun and rewarding. 

Built on the **MERN (MongoDB, Express.js, React.js, Node.js)** stack, ReWear features Clerk authentication, real-time user-to-user messaging, a dynamic point estimation calculator, swap request matching, and listing moderation.
## 🌟 Key Features

### 1. Peer-to-Peer Clothing Swapping
- **Swap Matcher**: Request trades for listed items. The system checks point values, and upon swap confirmation, automatically transfers the point balance between users.
- **Visual Transaction Flow**: Simulates listing upload, points processing, and final trade completion details.

### 2. Interactive "Estimate Your Points" Calculator
- **Points Estimation Engine**: Calculates item value based on category base values (Jackets, Shoes, Dresses, Shirts), clothing conditions (Like New, Excellent, Good, Fair), and brand tiers (Premium, Mid-range, Value).
- **Dynamic Progress Ring & Counter**: Points total increments dynamically with a color-changing progress ring indicating point value tiers (Gray $\rightarrow$ Blue $\rightarrow$ Green $\rightarrow$ Gold).
- **Formula Transparency**: Shows mathematical breakdown (`Base Category Value * Condition Multiplier * Brand Multiplier`) alongside estimated swap recommendations and real-time community demand badges.

### 3. Cloud-Based Item Listing & Moderation
- **Listing Upload**: Create listings with image uploads directly connected to **Cloudinary** storage using `multer-storage-cloudinary`.
- **Admin Moderation Panel**: Admins can approve or reject listed items to maintain high quality standards across the platform.

### 4. Secure Authentication & User Synchronization
- **Clerk Authentication**: Seamless, secure client-side sign-up and sign-in processes.
- **Clerk Webhooks via Svix**: Syncs Clerk user profiles (ID, email, name, avatar) instantly with the backend MongoDB database.

### 5. Chat & Inbox Messaging
- **Secure Communication**: Real-time message board for listing owners and prospective swappers to negotiate trades and coordinates.

### 6. Testimonials Masonry Grid
- Premium masonry grid displaying community reviews, verified users, locations, completed swap stats, and a transaction widget rendering actual thumbnails of swapped items.

---

## 🛠️ Technology Stack

| Frontend | Backend | Database & Storage |
| :--- | :--- | :--- |
| **React 19** (Vite) | **Node.js** | **MongoDB** (Mongoose) |
| **Tailwind CSS v4** | **Express.js** | **Cloudinary** (Image Storage) |
| **Framer Motion** (Animations) | **Clerk SDK** (Express Auth) | **Clerk** (User DB Sync) |
| **Lucide React** (Icon Pack) | **Svix** (Webhook verification) | |
| **Axios** & **React Query** | **Multer** (File parsing) | |

---

## 📂 Project Structure

```text
ReWear2/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connections
│   │   ├── controllers/     # Controller logic for items, swaps, messages
│   │   ├── middleware/      # Auth & file uploads
│   │   ├── models/          # Mongoose DB models (User, Item, Swap, Message)
│   │   ├── routes/          # Express API endpoints
│   │   └── server.js        # Entry point for Backend
│   ├── .env.example         # Example backend environment config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/          # Project assets and thumbnails
│   │   ├── components/      # UI components & Shared layout components
│   │   ├── pages/           # Page routes (Landing, Swaps, Items, Messaging, etc.)
│   │   └── App.jsx          # React app routes
│   ├── .env.example         # Example frontend environment config
│   └── package.json
└── README.md
```

---

## 💾 Database Schemas (Mongoose)

### 👤 User Schema (`User.js`)
Tracks the user's Clerk ID, points balance, name, email, avatar, listed clothing, and swap count.
```javascript
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  avatar: { type: String },
  points: { type: Number, default: 100 }, // Welcome bonus points
  swapsCompleted: { type: Number, default: 0 },
});
```

### 👕 Item Schema (`Item.js`)
Stores clothing listings uploaded by users. Items undergo admin approval before appearing publicly.
```javascript
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Jacket, Dress, Sweater, Shoes, Shirt
  size: { type: String, required: true },
  condition: { type: String, required: true }, // Like New, Excellent, Good, Fair
  brand: { type: String, required: true },
  points: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'swapped'], default: 'pending' },
});
```

### ⇄ Swap Schema (`Swap.js`)
Maintains transactions for proposed trades.
```javascript
const swapSchema = new mongoose.Schema({
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  initiatorItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  receiverItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  pointsExchanged: { type: Number, required: true },
});
```

---

## 🔌 API Endpoints

### Items API (`/api/items`)
* `GET /` — Fetch approved listed clothing items.
* `POST /` — Add a new item (Multer upload parses images to Cloudinary).
* `GET /:id` — Get specific item details.
* `PUT /:id` — Edit an item.
* `DELETE /:id` — Remove an item.

### Swaps API (`/api/swaps`)
* `POST /` — Propose a trade swap.
* `PUT /:id/status` — Accept, reject, or complete swap (Handles logic for point transfers).
* `GET /user/:userId` — Fetch user's active/completed swaps.

### Messages API (`/api/messages`)
* `POST /` — Send a chat message regarding a swap.
* `GET /chat/:userId/:otherUserId` — Get message history with another user.
* `GET /inbox` — Retrieve listing of active message threads.

### Admin API (`/api/admin`)
* `GET /items/pending` — Fetch pending listings for approval.
* `PUT /items/:id/approve` — Approve item listing.
* `PUT /items/:id/reject` — Reject item listing.

---

## ⚡ Setup & Installation

### 1. Prerequisites
Ensure you have the following accounts set up:
- **MongoDB Atlas** (Database hosting)
- **Clerk Dashboard** (User authentication)
- **Cloudinary** (Image hosting)

---

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder. Here are the environment variables used and their purposes:
   * `PORT`: The local port number on which the backend server runs (typically `5000`).
   * `MONGODB_URI`: The MongoDB connection string (local URI or Atlas URI) used to connect database schemas for user profiles, items, and swap logs.
   * `CLERK_PUBLISHABLE_KEY`: The public API key from your Clerk dashboard, used to verify client-side sessions.
   * `CLERK_SECRET_KEY`: The secret API key from your Clerk dashboard, used to make authenticated backend calls to Clerk API endpoints.
   * `CLERK_WEBHOOK_SECRET`: The cryptographic SVIX webhook secret key used to verify user sync webhooks triggered by Clerk user events.
   * `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud storage name, used for routing fashion listing image uploads.
   * `CLOUDINARY_API_KEY`: Your Cloudinary API key, used to authenticate asset upload requests.
   * `CLOUDINARY_API_SECRET`: Your Cloudinary API secret key, used to sign uploaded assets securely.
   * `FRONTEND_URL`: The domain URL of the client application (e.g. `http://localhost:5173`) to configure backend CORS middleware policies.

4. Run in development mode:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder. Here are the environment variables used and their purposes:
   * `VITE_CLERK_PUBLISHABLE_KEY`: The public API key from your Clerk dashboard, used to initialize Clerk context on the client application.
   * `VITE_API_URL`: The absolute backend server endpoint base URL (e.g. `http://localhost:5000/api`) used by Axios to query MERN endpoints.

4. Start the Vite server:
   ```bash
   npm run dev
   ```

---

## 📜 License
This project is licensed under the ISC License.
