import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import "./ChatSection.css";
import { useAuthContext } from "../../../context/AuthContextProvider";
import decodeJsonWebToken from "../../../utils/decodeJwt";
import { useSocket } from "../../../context/SocketContext";


function ChatSection({receiverId}) {
const socket = useSocket();

  const { getToken, getChats, getSearch, getMediaUpload } = useAuthContext();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [file, setFile] = useState(null);
  const token = getToken();
  const navigate = useNavigate();
  const userId = decodeJsonWebToken(token);
  const lastMessageRef = useRef(null);
//   let { receiverId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    navigate("/login");
  }

  const fetchMessage = async () => {
    try {
      const response = await getChats(userId, receiverId);
      if (response.data) {
        console.log("initially fetched messages: ", response.data);
        setMessage(response.data);
      }
    } catch (error) {
      console.log("error while fetching message: ", error);
    }
  };
  useEffect(() => {
    fetchMessage();

    if(!socket){
      console.log("returned from useEffect in Chat.jsx");
            return;
    }

    socket.emit("joinChat", userId);

    socket.off("newMessage").on("newMessage", (newMessage) => {
      setMessage((prevMessages) => {
        const updatedMessage = [...prevMessages, newMessage];
        return updatedMessage;
      });
    });
    socket.off("allchats").on("allchats", (chats) => {
      setMessage(chats);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket,userId, receiverId]);

  const searchMessage = async () => {
    if (searchKeyword.trim() === "") {
      return;
    }
    try {
      const response = await getSearch(userId, receiverId, searchKeyword);

      setMessage(response?.data);
    } catch (error) {
      console.log("Error searching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("sender", userId);
      formData.append("receiver", receiverId);
      formData.append("text", newMessage);
      formData.append("file", file);

      try {
        const response = await getMediaUpload(formData);
        setNewMessage("");

        const messageData = response.data;
        socket.emit("sendMediaMessage", { messageData, userId, receiverId }); // Emit with correct event name for media
        setIsLoading(false);
        setNewMessage("");
        setFile(null);
      } catch (error) {
        console.log("Error sending/saving message:", error);
      }
    } else {
      const messageData = {
        sender: userId,
        receiver: receiverId,
        text: newMessage,
      };
      try {
        if(socket){

          socket.emit("sendMessage", messageData);
        }

        setNewMessage("");
      } catch (error) {
        console.log("error while sending/saving message: ", error);
      }
    }
  };

  const deleteMessage = async (msgId) => {
    const messageId = {
      sender: userId,
      receiver: receiverId,
      messageId: msgId,
    };
    if(socket){

      socket.emit("deleteMessage", messageId);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  useEffect(() => {
    searchMessage();
  }, [searchKeyword]);

  return (
    <>
      <div>
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search messages..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className="chat-container">
          {message.length === 0 ? (
            <div>No messages Found.</div>
          ) : (
            message.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender !== userId ? "received" : "sent"
                } message  `}
                ref={index === message.length - 1 ? lastMessageRef : null}
              >
                {msg.isDeleted ? (
                  <p>This message was deleted</p>
                ) : (
                  <>
                    {msg.mediaUrl &&
                      (msg.mediaUrl.endsWith(".mp4") ? (
                        <video
                          controls
                          src={msg.mediaUrl}
                          className="media-file"
                        />
                      ) : (
                        <img
                          src={msg.mediaUrl}
                          alt="attachment"
                          className="media-file"
                        />
                      ))}
                    {/* Render the text below the media if it exists */}
                    {msg.text && <p className="message-text">{msg.text}</p>}
                  </>
                )}
                <div className="message-footer">
    <span className="timestamp">
      {msg.timestamp
        ? new Date(msg.timestamp).toLocaleString()
        : new Date(Date.now()).toLocaleString()}
    </span>
    {!msg?.isDeleted && (
      <button
        className="delete-button"
        onClick={() => deleteMessage(msg._id)}
      >
        X
      </button>
    )}
  </div>
              </div>
            ))
          )}
        </div>
        {isLoading && <div className="loading-indicator">Sending...</div>}
        {/* Loading indicator */}
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default ChatSection;
