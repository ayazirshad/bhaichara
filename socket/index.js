const { Server } = require("socket.io");
const port = process.env.PORT || 8000;

const io = new Server({ cors: "http://localhost:3000" });
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  console.log("A user connected");
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      userId !== null &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("online users: ", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

console.log("socket runing");
io.listen(port);
