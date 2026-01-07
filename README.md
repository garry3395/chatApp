# 💬 ChatApp – A Modern Real‑Time Messaging Platform

## 📝 Overview
ChatApp is a modern, full‑stack real‑time messaging application inspired by WhatsApp.  
It supports **online + offline chatting**, **photo sharing**, and **resend email functionality** 📧.  
The app is designed with the latest technologies to ensure scalability, security, and a smooth user experience 🌟.

---

## 🚀 Key Features
- ⚡ Real‑time messaging (online + offline)
- 🖼️ Photo sharing via Cloudinary API
- 📧 Resend Email functionality for account recovery
- 🔐 JWT Authentication & Authorization
- 🛡️ Arcjet integration + Rate limiting
- 🧠 State management with Zustand
- 🎨 Responsive UI with Tailwind CSS
- 🗄️ Database powered by MongoDB + Mongoose

📐 Architecture
The app follows a client‑server architecture:

Frontend (React + Zustand + Tailwind CSS)

Provides a responsive UI for chatting and photo sharing.

Zustand manages global state (user sessions, chat lists, messages).

Tailwind CSS ensures modern, mobile‑friendly design.

Backend (Node.js + Express + Arcjet)

Handles authentication, authorization, and API endpoints.

Implements rate limiting to prevent spam.

Uses JWT tokens for secure session management.

Database (MongoDB + Mongoose)

Stores user profiles, chat history, and media references.

Schema designed for scalability and quick queries.

Cloudinary API

Manages photo uploads and storage.

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

### 📧 Resend Email Flow  
![Resend Email](frontend/realImages/Screenshot%202026-01-07%20152857.png)

### 🧑‍💻 Developer Panel  
![Developer Panel](frontend/realImages/Screenshot%202026-01-07%20153200.png)

### 📱 WhatsApp-style UI  
![WhatsApp UI](frontend/realImages/WhatsApp%20Image%202026-01-07%20at%2011.00.26%20AM.jpeg)

### 📱 WhatsApp UI (Alt)  
![WhatsApp UI Alt](frontend/realImages/WhatsApp%20Image%202026-01-07%20at%2011.00.26%20AM%20(1).jpeg)

go to frontend and see images there in folder name "realImages"



