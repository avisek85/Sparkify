import React, { useState } from 'react';
import styles from './TopBar.module.css';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContextProvider';



function TopBar({setUsers}) {

  const {findProfile} = useAuthContext();

 async function handleSearch (e){
 

    const data = await findProfile(e.target.value);
    setUsers(data);
    console.log(data);
  }

  const [searchKeyword , setSearchKeyword] = useState("");
  return (
    <div className={styles.topBar}>
      <input type="text" placeholder="🔍 Search..." onChange={(e)=>{
       handleSearch(e);
      }}  className={styles.searchBar} />
      <div className={styles.profileIcon}>
        <img src="https://www.w3schools.com/w3images/avatar2.png" alt="User" />
      </div>
    </div>
  );
}

export default TopBar;
