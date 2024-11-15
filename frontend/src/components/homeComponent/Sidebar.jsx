import React, { useEffect, useState } from "react";
import { FaUser, FaHeart, FaSearch, FaHome, FaSnapchat } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "../../context/AuthContextProvider";

function Sidebar() {
  const [activeTab, setActiveTab] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuthContext();
  let userId;
  if (getToken()) {
    userId = jwtDecode(getToken());
  } else {
    navigate("/login");
  }

  // console.log(userId);

  const tabs = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "matches", label: "Matches", icon: <FaHeart /> },
    { id: "search", label: "Search", icon: <FaSearch /> },
    { id: "profile", label: "Profle", icon: <FaUser /> },
    { id: "chat", label: "Chat", icon: <FaSnapchat /> },

    // Add more tabs here
  ];

  useEffect(() => {
    if (location.pathname.includes("/profile")) {
      setActiveTab("profile");
    } else if (location.pathname.includes("/matches")) {
      setActiveTab("matches");
    } else if (location.pathname.includes("/search")) {
      setActiveTab("search");
    } else if (location.pathname.includes("/chat" || "chat")) {
      setActiveTab("chat");
    }else if (location.pathname.includes("/" || "/home")) {
      setActiveTab("home");
    }
  });

  const handleTabClick = (tabid) => {
    setActiveTab(tabid);
    console.log("tab id is ",tabid);
    if (tabid === "home") {
      return navigate("/");
    } else if (tabid === "matches") {
      return navigate("/matches");
    } else if (tabid === "profile") {
      return navigate(`/profile/${userId.id}`);
    } else if (tabid === "search") {
     return  navigate("/search");
    } else if (tabid === "chat") {
      return navigate("/chat");
    }
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.logo}>Sparkify</div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.sidebarButton} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
            
          </button>
        ))}
      </div>
    </>
  );
}

export default Sidebar;
