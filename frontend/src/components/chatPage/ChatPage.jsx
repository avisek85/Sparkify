import React from "react";
import { useAuthContext } from "../../context/AuthContextProvider";
import styles from "./ChatPage.module.css";
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
  <div className={styles.chatPageContainer}>
    <Sidebar  />
    {receiverId ? (
      <ChatSection receiverId={receiverId}  />
    ) : (
      <div className={styles.placeholder}>No Chats available</div>
    )}
    <ChatList  />
  </div>
  
  </>)
}

export default ChatPage;
