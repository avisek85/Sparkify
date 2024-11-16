import React, { useState } from "react";
import styles from "./TopBar.module.css";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContextProvider";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function TopBar({ setUsers }) {
  const { findProfile, getToken } = useAuthContext();
  const navigate = useNavigate();
  let userId;
  if (getToken()) {
    userId = jwtDecode(getToken());
  } else {
    navigate("/login");
  }

  async function handleSearch(e) {
    const data = await findProfile(e.target.value);
    setUsers(data);
    console.log(data);
  }

  const [searchKeyword, setSearchKeyword] = useState("");
  return (
    <div className={styles.topBar}>
      <input
        type="text"
        placeholder="🔍 Search..."
        onChange={(e) => {
          handleSearch(e);
        }}
        className={styles.searchBar}
      />
      <div className={styles.profileIcon}>
        <img src="https://www.w3schools.com/w3images/avatar2.png" alt="User" onClick={()=>{navigate(`/profile/${userId.id}`)}} />
      </div>
    </div>
  );
}

export default TopBar;
