import "./App.css";
import io from "socket.io-client";
import Chat from "./pages/chat";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

const socket = io.connect("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              username={username}
              setUsername={setUsername}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          }
        />
        <Route
          path="/chat"
          element={<Chat username={username} room={room} socket={socket} />}
        />
      </Routes>
    </Router>
  );
}
//   return (
//     <div className="App">
//       <div className="">
//         <h2>select your room</h2>
//       <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>222</button>
//       <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>257</button>
//       <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>213</button>
//       <button onClick={(e)=>{joinRoom(e.nativeEvent.target.innerHTML)}}>283</button>
//       </div>
//       <input
//         placeholder="message..."
//         value={sendMsg}
//         type="text"
//         onChange={(e) => {
//           setSendMsg(e.target.value);
//         }}
//       />
//       <button onClick={sendMessage}>Send Message</button>
//       <div className="" style={{marginTop: '2rem'}}>Your message:{sendMsg}</div>
//       <h1>message:{recvmsg}</h1>
//       {room ? (<h3>you are in room : {room}</h3>):(<h3>you are not in the room</h3>)}
//     </div>
//   );
// }

export default App;
