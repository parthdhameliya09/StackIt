const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const questionRoutes = require("./routes/questionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const userSockets = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register", (userId) => {
    userSockets[userId] = socket;
    console.log(`User ${userId} registered`);
  });

  socket.on("disconnect", () => {
    for (const [uid, s] of Object.entries(userSockets)) {
      if (s.id === socket.id) delete userSockets[uid];
    }
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);
app.set("userSockets", userSockets);

app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
