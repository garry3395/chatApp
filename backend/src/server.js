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

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// production build
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const PORT = ENV.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});