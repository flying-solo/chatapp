import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const Message = ({socket}) => {
  const [messagesRecieved, setMessageRecieved] = useState([]);

  function formatDateFromTimestamp(timestamp){
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
        console.log(data);
      setMessageRecieved((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => socket.off("recieve_message");
  },[socket]);


  return (
    <div className={styles.messagesColumn}>
      {messagesRecieved.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Message;
