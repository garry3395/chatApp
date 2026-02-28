import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import { ENV } from "./env.js";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const userId = socket.userId;

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("callUser", ({ to, offer, callType }) => {
  const receiverSocketId = userSocketMap[to];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("incomingCall", {
      from: userId,
      offer,
      callType,
    });
  }
});

socket.on("answerCall", ({ to, answer, callType }) => {
  const receiverSocketId = userSocketMap[to];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("callAccepted", {
      from: userId,
      answer,
      callType,
    });
  }
});

  socket.on("iceCandidate", ({ to, candidate }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("iceCandidate", {
        from: userId,
        candidate,
      });
    }
  });

  socket.on("endCall", ({ to }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callEnded");
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});