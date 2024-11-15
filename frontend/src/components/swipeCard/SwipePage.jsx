import React, { useEffect, useState } from 'react'

import SwipeCard from './SwipeCard';
import { useAuthContext } from '../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import  styles from "./SwipePage.module.css"

function SwipePage({users}) {
    const [profile,setProfile] = useState([]);
    const {loading,error,getAllProfile,getToken} = useAuthContext();
    const navigate = useNavigate();


    const fetchProfiles = async()=>{
      const data = await getAllProfile();
      console.log("data in swipePage: ",data);
      setProfile(data);
     
    };

    useEffect(()=>{
      if(!getToken()){
        navigate('/login');
      }
      else if(users){
        setProfile(users);
      }
      else{
        fetchProfiles();

      }
    },[getToken,navigate,users]);


    if (loading) {
      return (
        <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Fetching your profile...</p>
      </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.retryButton} onClick={fetchProfiles}>
          Retry
        </button>
        </div>
      );
    }


  return (
    <>
   

   <div className={styles.matchingProfilesContainer}>
      <h3 className={styles.swipePageHeading}>Matching Profiles</h3>
      <ul className={styles.profileList}>
        {profile?.length > 0 ? (
          profile.map((obj, index) => <SwipeCard key={index} profile={obj} />)
        ) : (
          <h3 className={styles.swipePageHeading}>No New Profiles</h3>
        )}
      </ul>
    </div>


    </>
  )
}

export default SwipePage