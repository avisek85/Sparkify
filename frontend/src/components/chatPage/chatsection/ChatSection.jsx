import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ChatSection.module.css";
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
        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search messages..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className={styles.chatContainer}>
          {message.length === 0 ? (
            <div>No messages Found.</div>
          ) : (
            message.map((msg, index) => (
              <div
                key={index}
                className={`${msg.sender !== userId ? styles.received : styles.sent} ${styles.message}`}
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
                          className={styles.mediaFile}
                        />
                      ) : (
                        <img
                          src={msg.mediaUrl}
                          alt="attachment"
                          className={styles.mediaFile}
                        />
                      ))}
                    {/* Render the text below the media if it exists */}
                    {msg.text && <p className={styles.messageText}>{msg.text}</p>}
                  </>
                )}
                <div className={styles.messageFooter}>
    <span className={styles.timestamp}>
      {msg.timestamp
        ? new Date(msg.timestamp).toLocaleString()
        : new Date(Date.now()).toLocaleString()}
    </span>
    {!msg?.isDeleted && (
      <button
        className={styles.deleteButton}
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
        {isLoading && <div className={styles.loadingIndicator}>Sending...</div>}
        {/* Loading indicator */}
        <div className={styles.inputContainer}>
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
