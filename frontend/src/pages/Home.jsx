import React, { useEffect, useState } from 'react';
import Sidebar from '../components/homeComponent/Sidebar';
import SwipePage from '../components/swipeCard/SwipePage';
import TopBar from '../components/homeComponent/TopBar';
import styles from './Home.module.css'; 

function Home() {

  const [users,setUsers] = useState(null);


  return (
    <div className={styles.homeContainer}>
      <Sidebar />

      <div className={styles.mainContent}>
        <TopBar setUsers = {setUsers} />

        <div className={styles.swipePageContainer}>
          <SwipePage users = {users} />
        </div>
      </div>
    </div>
  );
}

export default Home;
