import React from "react";
import { FaMusic, FaHiking, FaPaintBrush, FaHeart } from "react-icons/fa";
import styles from  "./Badge.module.css"

function Badge({ interest }) {
  const getIcon = (interest) => {
    switch (interest.toLowerCase()) {
      case "music":
        return <FaMusic />;
      case "hiking":
        return <FaHiking />;
      case "art":
      case "painting":
        return <FaPaintBrush />;

      default:
        return <FaHeart />;
    }
  };

  return <>
  <span className={styles.badge}>
    <span className={styles.badgeIcon}>
        {getIcon(interest)}
    </span>
    {interest}
  </span>
  </>;
}

export default Badge;
