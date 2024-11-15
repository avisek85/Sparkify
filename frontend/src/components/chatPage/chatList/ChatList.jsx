import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContextProvider";
import decodeJsonWebToken from "../../../utils/decodeJwt";
import axios from "axios";
import "./ChatList.css";
import { useSocket } from "../../../context/SocketContext";

function ChatList() {
  const API_URI = import.meta.env.VITE_API_URL;
  const socket = useSocket();
  const navigate = useNavigate();
  const { getToken } = useAuthContext();
  const [chats, setChats] = useState([]);

  const fetchChatList = useCallback(async () => {
    const response = await axios.get(`${API_URI}/user/chat/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log("response in fetching chatList ", response);
    setChats(response.data);
  }, [getToken]);

  // UseEffect for fetching chat list on load and handling socket events
  useEffect(() => {
    // Fetch chat list on component mount
    fetchChatList();

    // Register socket event
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
    <div className="chat-list-container">
      <div className="chat-list">
       {chats?.length === 0 ? <p className="no-chats">No chats available</p>:
        chats?.map((chat) => (
          <div
            key={chat._id}
            className="chat-item"
            onClick={() => navigate(`/chat/${chat?.participants[0]?._id}`)}
          >
            <img
              src={chat?.participants[0]?.profilePicture}
              alt="user-avatar"
              className="user-avatar"
            />
            <div className="chat-info">
              <h4>{chat?.participants[0]?.name}</h4>
              <p className="messageText">
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
