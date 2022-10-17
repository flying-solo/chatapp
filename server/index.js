const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const CHAT_BOT = "ChatBot";
let chatRoom = "";
let allUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join_room", (data) => {

    console.log(data);
    console.log("room joined", data.room);

    const { username, room } = data;
    socket.join(room);

    chatRoom = room;
    allUsers.push({ id: socket.id, username: username, room: room });
    let chatRoomUsers = allUsers.filter((user) => user.room == room);

    socket.to(room).emit("chat_Room_Users", chatRoomUsers);
    socket.emit("chat_Room_Users", chatRoomUsers);


    let __createdtime__ = Date.now();

    socket.to(room).emit("recieve_message", {
      message: `${username} entered the room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.emit("recieve_message", {
      message: `${username} welcome to the ${room} chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

  });

  socket.on("send_message", (data) => {
    console.log(data.message);
    socket.to(data.room).emit("recieve_message", data);
  });

});

app.get("/", (req, res) => {
  res.send("Server is running on port 4000");
});

server.listen(4000, () => {
  console.log("SERVER IS RUNNING ON 4000");
});
