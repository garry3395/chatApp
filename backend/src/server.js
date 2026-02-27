import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import express from "express";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";

import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ 
  origin: ENV.CLIENT_URL, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


const PORT = ENV.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});