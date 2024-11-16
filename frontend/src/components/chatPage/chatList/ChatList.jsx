import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContextProvider";
import decodeJsonWebToken from "../../../utils/decodeJwt";
import axios from "axios";
import styles from "./ChatList.module.css";
import { useSocket } from "../../../context/SocketContext";

function ChatList() {
  const API_URI = import.meta.env.VITE_API_URL;
  const socket = useSocket();
  const navigate = useNavigate();
  const { getToken,chatListFetchingFunction } = useAuthContext();
  const [chats, setChats] = useState([]);

  const fetchChatList = useCallback(async () => {

    const response = await chatListFetchingFunction();

    console.log("response in fetching chatList ", response);
    setChats(response.data);
  }, [getToken]);

  useEffect(() => {
    fetchChatList();

    if (socket) {
      console.log("Listening to 'reviseList' event in ChatList");
      socket.on("reviseList", fetchChatList);

      // Cleanup to avoid duplicate event listeners
      return () => {
        console.log("Cleaning up 'reviseList' event listener in ChatList");
        socket.off("reviseList", fetchChatList);
      };
    }
  }, [socket, fetchChatList]);

  return (
    <div className={styles.chatListContainer}>
      <div className={styles.chatList}>
       {chats?.length === 0 ? <p className={styles.noChats}>No chats available</p>:
        chats?.map((chat) => (
          <div
            key={chat._id}
            className={styles.chatItem}
            onClick={() => navigate(`/chat/${chat?.participants[0]?._id}`)}
          >
            <img
              src={chat?.participants[0]?.profilePicture}
              alt="user-avatar"
              className={styles.userAvatar}
            />
            <div className={styles.chatInfo}>
              <h4>{chat?.participants[0]?.name}</h4>
              <p className={styles.messageText}>
                {chat?.message[chat?.message.length - 1]?.text?.length > 30
                  ? chat.message[chat.message.length - 1].text.slice(0, 30) +
                    "..."
                  : chat?.message[chat?.message.length - 1]?.text}
              </p>
            </div>
          </div>
        ))}

       

      </div>
    </div>
  );
}

export default ChatList;
