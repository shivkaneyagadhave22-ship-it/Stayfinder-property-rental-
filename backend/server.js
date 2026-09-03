const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

dotenv.config();

const app = express();

const server = http.createServer(app);


// ========================================
// SOCKET.IO
// ========================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StayFinder Backend is Running 🚀",
  });
});


// ========================================
// AUTH ROUTES
// ========================================

app.use("/api/auth", authRoutes);


// ========================================
// MESSAGE ROUTES
// ========================================

app.use("/api/messages", messageRoutes);


// ========================================
// PROPERTY ROUTES
// ========================================

app.use("/api/properties", propertyRoutes);


// ========================================
// SOCKET.IO
// ========================================

io.on("connection", (socket) => {

  console.log("🟢 User connected:", socket.id);


  // ======================================
  // JOIN PERSONAL ROOM
  // ======================================

  socket.on("joinRoom", (userId) => {

    if (!userId) {
      return;
    }

    socket.join(userId);

    console.log(
      `👤 User ${userId} joined room`
    );

  });


  // ======================================
  // REAL-TIME MESSAGE
  // ======================================

  socket.on("sendMessage", (data) => {

    try {

      const {
        _id,
        sender,
        receiver,
        message,
        property,
        createdAt,
      } = data;


      if (
        !sender ||
        !receiver ||
        !message
      ) {

        console.log(
          "❌ Invalid socket message"
        );

        return;
      }


      const socketMessage = {
        _id: _id || Date.now().toString(),

        sender,

        receiver,

        message,

        property: property || null,

        createdAt:
          createdAt || new Date().toISOString(),
      };


      // ==================================
      // SEND TO RECEIVER
      // ==================================

      io.to(receiver).emit(
        "receiveMessage",
        socketMessage
      );


      // ==================================
      // SEND TO SENDER
      // ==================================

      io.to(sender).emit(
        "messageSent",
        socketMessage
      );


      console.log(
        "💬 Message delivered:",
        sender,
        "→",
        receiver
      );

    } catch (error) {

      console.error(
        "Socket Message Error:",
        error
      );

    }

  });


  // ======================================
  // DISCONNECT
  // ======================================

  socket.on("disconnect", () => {

    console.log(
      "🔴 User disconnected:",
      socket.id
    );

  });

});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 StayFinder Backend running on http://localhost:${PORT}`
  );

});