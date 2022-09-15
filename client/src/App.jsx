import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [recvmsg, setrecvMsg] = useState("");
  const [sendMsg, setSendMsg] = useState("");

  const [room,setRoom] = useState();

  const sendMessage = () => {
    if(room){
      socket.emit("send_message", { message : sendMsg ,roomno : room });
    }else{
      setrecvMsg("Select the room")
    }
  };

  const joinRoom = (room) => {
    setRoom(room);
    socket.emit("join_room",{roomno : room});
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setrecvMsg(data.message);
      console.log(data);
    });
  }, [socket]);



  return (
    <div className="App">
      <div className="">
        <h2>select your room</h2>
      <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>222</button>
      <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>257</button>
      <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>213</button>
      <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>283</button>
      </div>
      <input
        placeholder="message..."
        value={sendMsg}
        type="text"
        onChange={(e) => {
          setSendMsg(e.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>message:{recvmsg}</h1>
      {room ? (<h3>you are in room : {room}</h3>):(<h3>you are not in the room</h3>)}
    </div>
  );
}

export default App;
