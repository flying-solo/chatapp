const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
    },
});

io.on("connection", (socket)=>{
    console.log(`User connected ${socket.id}`);

    socket.on("join_room", (data)=>{
        socket.join(data.roomno);
        console.log("room joined",data.roomno);
    })

    socket.on("send_message", (data)=>{
        console.log(data.message);
        socket.to(data.roomno).emit("recieve_message", data);
    });
});



server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});

