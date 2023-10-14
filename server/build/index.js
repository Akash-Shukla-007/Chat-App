"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("dotenv").config();
var mongoose = require("mongoose");
var cors = require("cors");
var authRoutes = require("./Routes/AuthRoutes");
var chatRoutes = require("./Routes/ChatRoutes");
var MessageRoutes = require("./Routes/MessageRoutes");
var errorMiddleware_1 = require("./Middleware/errorMiddleware");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
//SOCKETS
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    pingTimeout: 6000,
    cors: {
        origin: ["http://localhost:5173", "*"],
    },
});
io.on("connection", function (socket) {
    console.log("Connected to socket");
    socket.on("setup", function (userData) {
        socket.join(userData.id);
        console.log("connected", userData.name);
    });
    socket.on("join-room", function (room) {
        socket.join(room._id);
        console.log("User joined Room ", room._id);
    });
    socket.on("new-message", function (recievedMessage) {
        var chat = recievedMessage.chat;
        if (!chat.users)
            return console.log("chat.users not defined");
        chat.users.forEach(function (user) {
            if (user._id === recievedMessage.sender._id)
                return;
            socket.in(user._id).emit("recieved-message", recievedMessage);
        });
    });
    socket.on("typing", function (room) { return socket.in(room).emit("typing"); });
    socket.on("stop-typing", function (room) { return socket.in(room).emit("stop-typing"); });
    socket.off("setup", function (userData) {
        socket.leave(userData.id);
        console.log("disconnected");
    });
});
// ROUTES
app.get("/", function (req, res) {
    res.send("Welcome To Chat-Box");
});
app.use("/user", authRoutes);
app.use("/chat", chatRoutes);
app.use("/message", MessageRoutes);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
// DB CONNECTION
var PORT = process.env.PORT;
mongoose
    .connect(process.env.DB_URL)
    .then(function () {
    httpServer.listen(PORT || 8000, function () {
        console.log("Server running at Port ".concat(PORT));
    });
})
    .catch(function (err) { return console.log(err); });
