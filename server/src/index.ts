import express from "express";
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/AuthRoutes");
const chatRoutes = require("./Routes/ChatRoutes");
const MessageRoutes = require("./Routes/MessageRoutes");
import { errorHandler, notFound } from "./Middleware/errorMiddleware";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());

//SOCKETS
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 6000,
  cors: {
    origin: ["http://localhost:5173", "*", "https://chatbox-c1b7e.web.app"],
  },
});
io.on("connection", (socket: any) => {
  console.log("Connected to socket");

  socket.on("setup", (userData: any) => {
    socket.join(userData.id);
    console.log("connected", userData.name);
  });

  socket.on("join-room", (room: any) => {
    socket.join(room._id);
    console.log("User joined Room ", room._id);
  });

  socket.on("new-message", (recievedMessage: any) => {
    var chat = recievedMessage.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user: any) => {
      if (user._id === recievedMessage.sender._id) return;
      socket.in(user._id).emit("recieved-message", recievedMessage);
    });
  });

  socket.on("typing", (room: any) => socket.in(room).emit("typing"));

  socket.on("stop-typing", (room: any) => socket.in(room).emit("stop-typing"));

  socket.off("setup", (userData: any) => {
    socket.leave(userData.id);
    console.log("disconnected");
  });
});

// ROUTES
app.get("/", (req: any, res: any) => {
  res.send("Welcome To Chat-Box");
});
app.use("/user", authRoutes);
app.use("/chat", chatRoutes);
app.use("/message", MessageRoutes);
app.use(notFound);
app.use(errorHandler);

// DB CONNECTION

const PORT = process.env.PORT;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    httpServer.listen(PORT || 8000, () => {
      console.log(`Server running at Port ${PORT}`);
    });
  })
  .catch((err: any) => console.log(err));
