import React, { useState } from "react";
import styles from "./SwipeCard.module.css";
import { useAuthContext } from "../../context/AuthContextProvider";
import { FaHeart as LikeIcon, FaTrash as DislikeIcon, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function SwipeCard({ profile }) {
  const [swiped, setSwiped] = useState(false);
  const { getSwipped } = useAuthContext();

  const handleSwipe = async (direction) => {
    console.log(`swiped ${direction} on ${profile.name}`);

    const flag = await getSwipped(profile._id, direction);
    if (flag) {
      setSwiped(flag);
    }
  };
  if (swiped) {
    return null;
  }

  return (
    <>
      <div className={styles.swipeCard}>
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src={
              profile.profilePicture ||
              "https://www.w3schools.com/w3images/avatar2.png"
            }
            alt={profile.name}
          />
          <div className={styles.cardBody}>
            <h5 className={styles.cardTitle}>
              <span>{profile?.name}</span> -{" "}
              <span>{profile?.age}</span>
            </h5>
           
            <div>
            <Link to={`/profile/${profile._id}`} title="View Profile">
              <FaUser className={styles.viewprofileicon} />
            </Link>
          </div>

            <div className={styles.buttonContainer}>
              <DislikeIcon
                className={styles.dislikeButton}
                onClick={() => handleSwipe("left")}
                title="Dislike"
              />
              <LikeIcon
                className={styles.likeButton}
                onClick={() => handleSwipe("right")}
                title="Like"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SwipeCard;
