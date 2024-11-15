import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import Badge from "./Badge";
import { useAuthContext } from "../../context/AuthContextProvider";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../homeComponent/Sidebar";

function Profile() {
  const {userId} = useParams();
  let { getToken, getProfile, error, loading,logout,userProfile } = useAuthContext();
  const [profile, setProfile] = useState({});
  // console.log("userid in profile after called: ",userId);
  let currentUserId = jwtDecode(getToken()).id;

  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
    else {
      fetchProfile();
    }
  }, [getToken, navigate, getProfile]);

  const fetchProfile = async () => {
    const profileData = await getProfile(userId); // Await the promise
    if (profileData) {
      setProfile(profileData);
    }
  };

const handleLogOut = async()=>{
try {
  const flag =await logout();
  if(flag){
    navigate('/login');
  }
 
} catch (error) {
  console.log("Error while logout");
}
}

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
      <p>{error}</p>
      <button onClick={fetchProfile}>Retry</button>
    </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <Sidebar className={styles.sidebar} />
      <div className={styles.profileContent}>
        <div className={styles.profileHeader}>Profile</div>
        
        

        <div className={styles.profileInfoContainer}>
          <img
            className={styles.profileImage}
            src={
              profile.profilePicture ||
              "https://www.w3schools.com/w3images/avatar2.png"
            }
            alt="Profile"
          />
          <div className={styles.profileDetails}>
            <h3>{profile?.name || "No name available"}</h3>
            <div className={styles.profileStats}>
              <p>Age: {profile?.age || "N/A"}</p>
              <p>Gender: {profile?.gender || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.bioSection}>
            <h4>Bio</h4>
            <p>{profile.bio || "No bio available"}</p>
          </div>
          <div className={styles.interestsSection}>
            <h4>Interests</h4>
            <div className={styles.badgesContainer}>
              {profile?.interest?.length > 0
                ? profile.interest.map((interest, index) => (
                      <Badge key={index} interest={interest}/>
                  ))
                : "No interests available"}
            </div>
          </div>
          <div className={styles.lookingForSection}>
            <h4>Looking For</h4>
            <div className={styles.badgesContainer}>
              {profile?.lookingFor?.length > 0
                ? profile.lookingFor.map((interest, index) => (
                      <Badge key={index} interest={interest}/>
                  ))
                : "No LookingFor available"}
            </div>
          </div>
         
        </div>
         {userId === currentUserId && (
            <div className={styles.buttonSection}>
              <button
                className={`${styles.editBtn}`}
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profile
              </button>
              <button
                className={`${styles.logoutBtn}`}
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          )}
        {/* {userId === currentUserId && (<>
           <button
           className={`${styles.editBtn}`}
           onClick={() => navigate("/profile/edit")}
         >
           Edit Profile
         </button>
          <button className={`${styles.logoutBtn}`} onClick={handleLogOut}>Log Out</button>
          </>
        )} */}
      </div>
    </div>
  );
}

export default Profile;
