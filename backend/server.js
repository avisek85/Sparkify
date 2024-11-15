const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
require("./config/configure");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const matchesRoutes = require("./routes/matchesRoute");
const chatRoutes = require("./routes/chatRoute");
const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
    cors:{
        origin:"*"
    }
});
app.use(cors());
app.use(express.json());

app.set('io',io);
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/profile", profileRoutes);
app.use("/api/user/matches", matchesRoutes);
app.use("/api/user/chat", chatRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports = io;


