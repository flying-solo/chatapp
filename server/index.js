require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require('./services/harper-get-messages');
const leaveRoom = require('./utils/leave-room');

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
    const { username, room } = data;
    console.log(data);
    socket.join(room);
    console.log("room joined", data.room);
    chatRoom = room;
    allUsers.push({ id: socket.id, username: username, room: room });
    let chatRoomUsers = allUsers.filter((user) => user.room == room);

    harperGetMessages(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit('last_100_messages', last100Messages);
      })
      .catch((err) => console.log(err));
    
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

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
    console.log(data);
    const { username, room, message, __createdtime__ } = data;
    io.in(room).emit("recieve_message", data);
    harperSaveMessage(username, room, message, __createdtime__)
      .then((res) => console.log("this is response",res))
      .catch((err) => console.log(err));
  });

  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    console.log(`${username} has left the chat`);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running on port 4000");
});

server.listen(4000, () => {
  console.log("SERVER IS RUNNING ON 4000");
});
