# 🎵 Spotify Clone

A full-stack Spotify-inspired music streaming application built with React, Node.js, MongoDB, and Socket.io. Features real-time chat, live activity tracking, music playback, and an admin dashboard.

Live Demo : https://realtime-spotify-clone-q5li.onrender.com/

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black) ![Clerk](https://img.shields.io/badge/Clerk-Auth-purple)

---

## ✨ Features

- 🎵 **Music Playback** — Play, pause, skip, and control volume with a full-featured player
- 📀 **Albums & Songs** — Browse albums and songs with cover art
- 💬 **Real-time Chat** — Message other users instantly using Socket.io
- 👀 **Friends Activity** — See what your friends are listening to in real time
- 🟢 **Online Status** — See who is online and who is offline
- 🔐 **Authentication** — Secure login with Google OAuth via Clerk
- 🛠️ **Admin Dashboard** — Add/delete songs and albums, view platform stats
- ☁️ **Cloud Storage** — Audio and image files stored on Cloudinary
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Zustand | State management |
| Axios | HTTP requests |
| Socket.io Client | Real-time communication |
| Clerk | Authentication |
| React Router | Routing |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| Socket.io | Real-time events |
| Clerk Express | Auth middleware |
| Cloudinary | File storage |
| express-fileupload | File uploads |
| dotenv | Environment variables |

---

## 📁 Project Structure

```
spotify-clone/
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared components (Topbar, AudioPlayer, etc.)
│   │   ├── pages/
│   │   │   ├── home/         # Home page + Admin dashboard
│   │   │   ├── chat/         # Chat page + components
│   │   │   └── album/        # Album detail page
│   │   ├── stores/           # Zustand stores
│   │   │   ├── useMusicStore.ts
│   │   │   ├── useChatStore.ts
│   │   │   ├── usePlayerStore.ts
│   │   │   └── useAuthStore.ts
│   │   ├── lib/              # Axios instance
│   │   └── types/            # TypeScript types
│   └── public/
│
└── backend/
    ├── src/
    │   ├── controllers/      # Route controllers
    │   ├── models/           # Mongoose models
    │   ├── routes/           # Express routes
    │   ├── middleware/        # Auth middleware
    │   ├── lib/              # DB connection, Cloudinary
    │   └── socket/           # Socket.io setup
    └── .env
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Clerk account

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/spotify-clone.git
cd spotify-clone
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/spotify-clone
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=your_admin_email@example.com
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

The app will be running at `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `CLERK_SECRET_KEY` | Clerk backend secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_EMAIL` | Email address with admin privileges |
| `NODE_ENV` | development or production |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_API_BASE_URL` | Backend API base URL |

---

## 📡 API Routes

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/callback` | Sync Clerk user to MongoDB |

### Songs
| Method | Route | Description |
|---|---|---|
| GET | `/api/songs` | Get all songs |
| GET | `/api/songs/featured` | Get featured songs |
| GET | `/api/songs/made-for-you` | Get made-for-you songs |
| GET | `/api/songs/trending` | Get trending songs |

### Albums
| Method | Route | Description |
|---|---|---|
| GET | `/api/albums` | Get all albums |
| GET | `/api/albums/:id` | Get album by ID |

### Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/users` | Get all users (except self) |
| GET | `/api/users/messages/:userId` | Get messages with a user |

### Admin (requires admin role)
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/check` | Check admin status |
| POST | `/api/admin/songs` | Add a new song |
| DELETE | `/api/admin/songs/:id` | Delete a song |
| POST | `/api/admin/albums` | Add a new album |
| DELETE | `/api/admin/albums/:id` | Delete an album |

### Stats
| Method | Route | Description |
|---|---|---|
| GET | `/api/stats` | Get platform statistics |

---

## 🔌 Socket Events

| Event | Direction | Description |
|---|---|---|
| `user_connected` | Client → Server | User comes online |
| `users_online` | Server → Client | List of online users |
| `user_disconnected` | Server → All | User goes offline |
| `update_activity` | Client → Server | Update what user is playing |
| `activity_updated` | Server → All | Broadcast activity change |
| `send_message` | Client → Server | Send a chat message |
| `message_sent` | Server → Sender | Message saved confirmation |
| `receive_message` | Server → Receiver | Incoming message |

---

## 🎨 Screenshots

| Home | Album Page |
|---------|-------|
| ![Home](https://github.com/user-attachments/assets/9b1ea671-95ec-448a-9241-5da543320349) | ![Album Page](https://github.com/user-attachments/assets/c6979a67-5362-4202-bf54-bf28f6c196a0) |

| Admin Dashboard | Messages |
|---------|-------|
| ![Admin Dashboard](https://github.com/user-attachments/assets/c70be48f-153d-4a26-b9bf-a64ccf05f781) | ![Messages](https://github.com/user-attachments/assets/84cf02e0-1088-4b64-9206-be44c755b039) |

---

## 🚢 Deployment

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
```

Update `.env` with production API URL:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Backend (Render / Railway)

Set all environment variables in your hosting dashboard and deploy the `backend/` folder.

Update CORS origin in `server.js` to your frontend URL:
```javascript
app.use(cors({
    origin: "https://your-frontend.vercel.app",
    credentials: true
}))
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is for educational purposes only. All music content used is fictional/sample data.

---

## 👨‍💻 Author

Built with ❤️ as a full-stack learning project.
