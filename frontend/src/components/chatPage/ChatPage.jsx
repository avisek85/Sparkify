import React from "react";
import { useAuthContext } from "../../context/AuthContextProvider";
import "./ChatPage.css";
import ChatSection from "./chatsection/ChatSection";
import { useParams } from "react-router-dom";
import ChatList from "./chatList/ChatList";
import Sidebar from "../homeComponent/Sidebar";


function ChatPage() {

  
  const { getToken} = useAuthContext();
  const {receiverId} = useParams();
  console.log("We are in chat page with receiver id is ",receiverId);

  const token = getToken();

  if (!token) {
    navigate("/login");
  }








  return(<>
  <div className="chat-page-container">
    <Sidebar className="sidebar" />
    {receiverId ? (
      <ChatSection receiverId={receiverId} className="chat-section" />
    ) : (
      <div className="placeholder">No Chats available</div>
    )}
    <ChatList className="chat-list-container" />
  </div>
  
  </>)
}

export default ChatPage;
