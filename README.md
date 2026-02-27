# 💬 ChatApp – A Modern Real‑Time Messaging Platform

## 📝 Overview

ChatApp is a **full-stack real-time messaging application** inspired by WhatsApp, built with cutting-edge web technologies. It provides users with seamless communication through online/offline messaging, photo sharing, secure authentication, and email notifications. The application is designed for scalability, security, and an exceptional user experience.

**Live Features:** Real-time messaging, photo sharing via Cloudinary, JWT authentication, Arcjet rate limiting, and email functionality via Resend.

---

## 🚀 Key Features

- ⚡ **Real-time Messaging** – Online and offline chat support with Socket.io
- 🖼️ **Photo Sharing** – Upload and share images via Cloudinary API
- 📧 **Email Notifications** – Account recovery and verification via Resend
- 🔐 **JWT Authentication** – Secure token-based authentication
- 🛡️ **Rate Limiting & Security** – Arcjet integration to prevent abuse
- 🧠 **State Management** – Zustand for efficient global state
- 🎨 **Responsive UI** – Tailwind CSS with mobile-first design
- 🗄️ **MongoDB Database** – Mongoose ODM for data persistence
- 🔌 **WebSocket Support** – Real-time communication with Socket.io

---

## 🏗️ Architecture Overview

### **Frontend** (React + Vite + Tailwind CSS)
- **React 19** – Modern UI library with hooks
- **Vite** – Lightning-fast build tool
- **Zustand** – Lightweight state management
- **Socket.io Client** – Real-time communication
- **Axios** – HTTP client for API calls
- **Tailwind CSS + DaisyUI** – Modern, responsive styling
- **Framer Motion** – Smooth animations
- **React Router** – Client-side routing
- **Lucide React** – Icon library

### **Backend** (Node.js + Express)
- **Express.js** – RESTful API framework
- **Socket.io** – Real-time bidirectional communication
- **MongoDB + Mongoose** – NoSQL database with schema validation
- **JWT (jsonwebtoken)** – Secure authentication tokens
- **Bcryptjs** – Password hashing
- **Arcjet** – Security middleware (rate limiting, bot detection, shield)
- **Cloudinary** – Cloud image storage and management
- **Resend** – Email delivery service
- **Cookie Parser** – HTTP cookie handling
- **CORS** – Cross-origin request handling

### **Database** (MongoDB)
- **User Schema** – Stores user profiles, emails, passwords, and profile pictures
- **Message Schema** – Stores sender, receiver, text, images, and timestamps
- Indexed queries for fast retrieval
- Timestamp tracking for all documents

---

## 📂 Project Structure

```
chatApp/
├── frontend/                    # React Vite application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── store/              # Zustand stores
│   │   ├── lib/                # Utilities and configurations
│   │   ├── index.css           # Global styles
│   │   ├── main.jsx            # Entry point
│   │   └── App.jsx             # Root component
│   ├── package.json
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── eslint.config.js        # ESLint configuration
│
├── backend/                     # Node.js Express server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   └── messageController.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   └── message.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Message.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── arcjet.middleware.js
│   │   │   └── socket.auth.middleware.js
│   │   ├── lib/                # Utility functions
│   │   │   ├── db.js           # Database connection
│   │   │   ├── env.js          # Environment variables
│   │   │   ├── socket.js       # Socket.io configuration
│   │   │   ├── arcjet.js       # Security rules
│   │   │   ├── cloudinary.js   # Image upload service
│   │   │   ├── resend.js       # Email service
│   │   │   └── utils.js        # Helper functions
│   │   ├── emails/             # Email templates
│   │   │   ├── emailHandlers.js
│   │   │   └── emailTemplates.js
│   │   └── server.js           # Express app setup
│   ├── package.json
│   └── .env.example            # Environment variables template
│
├── package.json                # Root package.json
└── README.md                   # This file
```

---

## 🔧 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, DaisyUI |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, Bcryptjs |
| **Security** | Arcjet (rate limiting, bot detection) |
| **File Storage** | Cloudinary |
| **Email** | Resend |
| **State Management** | Zustand |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Cloudinary Account** (for image uploads)
- **Resend Account** (for email functionality)
- **Arcjet Account** (for security and rate limiting)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/garry3395/chatApp.git
cd chatApp
```

#### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (use `.env.example` as reference):
```bash
cp .env.example .env
```

Fill in your environment variables in `.env`.

#### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

#### 4. Build and Run

**Development Mode:**
```bash
# From root directory
npm run dev      # Runs backend in dev mode
```

**Production Build:**
```bash
npm run build    # Installs dependencies and builds frontend
npm start        # Starts backend server with production frontend
```

---

## 🔐 Environment Variables

All environment variables are defined in `backend/.env.example`. Create a `.env` file with the following:

### Backend Configuration
```plaintext
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=ChatApp

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security (Arcjet)
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=production
```

See [.env.example](backend/.env.example) for detailed variable descriptions.

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` – Register new user
- `POST /login` – Login user
- `POST /logout` – Logout user
- `GET /me` – Get current user info

### Message Routes (`/api/messages`)
- `GET /users` – Get all users
- `GET /:id` – Get chat history with specific user
- `POST /send/:id` – Send message to user
- `DELETE /:id` – Delete message

---

## 🔌 WebSocket Events

### Client → Server
- `connect` – User connects
- `send_message` – Send real-time message
- `user_typing` – Typing indicator
- `disconnect` – User disconnects

### Server → Client
- `new_message` – New message received
- `user_connected` – User came online
- `user_disconnected` – User went offline

---

## 🔒 Security Features

1. **Arcjet Integration**
   - SQL injection protection (Shield mode)
   - Bot detection and blocking
   - Sliding window rate limiting (100 requests/60s)

2. **JWT Authentication**
   - Token-based session management
   - HTTP-only cookies for token storage

3. **Password Security**
   - Bcryptjs hashing (salt rounds: 10)
   - Minimum 6 characters requirement

4. **CORS Protection**
   - Configured for specific client URL
   - Credentials support enabled

---

## 🎨 Frontend Features

### Components
- **ChatContainer** – Main chat view with message display
- **MessageInput** – Input area with photo upload
- **ChatsList** – List of active conversations
- **ContactList** – All users for messaging
- **ProfileHeader** – User profile section
- **ChatHeader** – Active chat header
- **ActiveTabSwitch** – Tab navigation

### Pages
- **LoginPage** – User authentication
- **SignUpPage** – User registration
- **ChatPage** – Main messaging interface
- **VedioCallPage** – Video call interface (placeholder)

### State Management (Zustand)
- `useAuthStore` – User authentication state
- `useChatStore` – Chat messages and conversations

---

## 💾 Database Models

### User Schema
```javascript
{
  fullname: String (required, 3+ chars),
  email: String (required, unique),
  password: String (required, hashed),
  profilePic: String (URL from Cloudinary),
  timestamps: true
}
```

### Message Schema
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  text: String (max 2000 chars),
  image: String (Cloudinary URL),
  timestamps: true
}
```

---

## 🧪 Testing & Development

### Lint Code
```bash
cd frontend
npm run lint
```

### Build Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

### Development Mode
```bash
cd backend
npm run dev      # Runs with Nodemon for auto-reload
```

---

## 📦 Available Scripts

**Root Directory:**
```bash
npm run build    # Build entire application
npm start        # Start production server
```

**Backend:**
```bash
npm start        # Start server
npm run dev      # Start with Nodemon (development)
```

**Frontend:**
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)
1. Build: `npm run build`
2. Deploy the `frontend/dist` folder
3. Set environment variables in deployment platform

### Backend (Heroku, Railway, Render, etc.)
1. Set all environment variables
2. Deploy the entire project
3. Ensure `NODE_ENV=production`
4. MongoDB connection string must be accessible

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Ensure MongoDB cluster is accessible
- Check IP whitelist in MongoDB Atlas

### Cloudinary Upload Issues
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Ensure image file size is under limit

### Email Not Sending
- Verify `RESEND_API_KEY` and `EMAIL_FROM` are correct
- Check Resend dashboard for API key validity

### Rate Limiting Issues
- Adjust `interval` and `max` in `backend/src/lib/arcjet.js`
- Verify `ARCJET_KEY` is valid

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License – see the LICENSE file for details.

---

## 👨‍💻 Author

**Garry** – [GitHub](https://github.com/garry3395)

---

## 🎯 Future Enhancements

- [ ] Video calling functionality
- [ ] Message search and filtering
- [ ] Group chats
- [ ] Message read receipts
- [ ] Voice messages
- [ ] End-to-end encryption
- [ ] Dark mode toggle
- [ ] User blocking feature
- [ ] Message reactions
- [ ] File sharing (documents, audio)

---

## 📞 Support

For issues, questions, or suggestions, please open an [issue](https://github.com/garry3395/chatApp/issues) on GitHub.

---

**Made with ❤️ using React, Node.js, and MongoDB**

Provides optimized delivery of images.

🔒 Security
JWT Authentication ensures only valid users can access chats.

Authorization middleware restricts access to protected routes.

Rate limiting prevents brute force attacks and spam.

Arcjet integration adds an extra layer of backend security.

📦 Installation Guide
Prerequisites
Node.js  (v16+ recommended)

MongoDB installed locally or cloud instance (MongoDB Atlas)

Cloudinary account for media storage
# Clone the repository
git clone https://github.com/garry3395/chatapp.git

# Navigate into the project
cd chatapp

# Install dependencies
npm install

# Setup environment variables
touch .env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_url
ARCJET_KEY=your_arcjet_key
add follwing to env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_url
ARCJET_KEY=your_arcjet_key
📲 Usage
Register or login with JWT authentication.

Start chatting with online/offline support.

Upload and send photos via Cloudinary.

Enjoy a responsive UI built with Tailwind CSS.

📊 State Management with Zustand
Instead of Redux, Zustand is used for lightweight and modern state management.
Benefits:

Minimal boilerplate.

Easy to integrate with React hooks.

Better performance for real‑time apps.

🖼️ Media Handling with Cloudinary
Upload photos directly from chat.

Cloudinary optimizes delivery.

Secure URLs ensure privacy.

📈 Scalability
MongoDB schemas designed for millions of messages.

Stateless JWT authentication allows horizontal scaling.

Cloudinary handles large media loads.

⚠️ Limitations
No video/voice calling in current version.

Offline mode limited to cached messages.

Requires stable internet for Cloudinary uploads.

🛣️ Future Roadmap
Add video and voice calling.

Implement end‑to‑end encryption.

Add group chats and broadcast messages.

Push notifications for new messages.

Dark mode and theme customization.

🤝 Contributing
Pull requests are welcome. Please open an issue first to discuss changes.  
## 🖼️ Screenshots

Here are some visuals from the ChatApp interface:

### 🔐 Login Page  
![Login Page](frontend/realImages/Screenshot%202026-01-07%20152421.png)

### 💬 Chat Window  
![Chat Window](frontend/realImages/Screenshot%202026-01-07%20152608.png)

### 📤 Photo Upload Feature  
![Photo Upload](frontend/realImages/Screenshot%202026-01-07%20152622.png)

### 📥 Offline Message View  
![Offline Message](frontend/realImages/Screenshot%202026-01-07%20152837.png)

### UI
![Resend Email](frontend/realImages/Screenshot%202026-01-07%20152857.png)

### 🧑‍💻 Developer Panel  
![Developer Panel](frontend/realImages/Screenshot%202026-01-07%20153200.png)

 ### 📧 Resend Email Flow  
![WhatsApp UI](frontend/realImages/WhatsApp%20Image%202026-01-07%20at%2011.00.26%20AM.jpeg)

### 📧 Resend Email Flow  
![WhatsApp UI Alt](frontend/realImages/WhatsApp%20Image%202026-01-07%20at%2011.00.26%20AM%20(1).jpeg)

go to frontend and see images there in folder name "realImages"



