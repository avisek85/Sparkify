import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContextProvider';
import SwipeCard from '../swipeCard/SwipeCard';
import styles from "./SearchPage.module.css";

function SearchPage() {
    const [ageRange,setAgeRange] = useState([18,30]);
    const [gender,setGender] = useState("");
    const [lookingFor,setLookingFor] = useState("");
    const [interest,setInterest] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const {getToken,userProfile} = useAuthContext();
     const navigate = useNavigate();
  
 

    const availableInterest = ["MUSIC","TRAVEL","FITNESS","MOVIES","READING"];

    const handleInterestChange = (item) => {
        setInterest((prev) =>
          prev.includes(item)
            ? prev.filter((i) => i !== item)
            : [...prev, item]
        );
      };

      const handleSearch = () => {
        const preferences = { ageRange, gender, lookingFor, interest };
        onSave(preferences);
      }


      const onSave = async () => {
      
        const preferences = {
          ageRange,
          interest,
          gender,
          lookingFor,
        };
    
        try {

            const response = await axios.post('/api/user/search', preferences,{
                headers:{
                    Authorization:`Bearer ${getToken()}`
                }
            });
            console.log(response);
            setProfiles(response.data); 
        } catch (error) {
            console.error("Error fetching profiles:", error);
          alert('Error fetching preferences');
        }
      };
    

  return (<>
    <div className={styles.preferenceContainer} >
         <h2>Discovery Preferences</h2>
         <div className={styles.preferenceItem}>
        <label>Age Range: {ageRange[0]} - {ageRange[1]}</label>
        <input
          type="range"
          min="10"
          max="80"
          value={ageRange[0]}
          onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
        />
        <input
          type="range"
          min="10"
          max="80"
          value={ageRange[1]}
          onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
        />
      </div>

         {/* Gender */}
         <div className={styles.preferenceItem}>
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

  {/* Looking For */}
  <div className={styles.preferenceItem}>
        <label>Looking For</label>
        <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
          <option value="any">Any</option>
          <option value="CASUAL">CASUAL</option>

          <option value="FRIENDSHIP">FRIENDSHIP</option>

          <option value="SERIOUS_RELATIONSHIP">SERIOUS RELATIONSHIP</option>

        </select>
      </div>
  {/* Interests */}
  <div className={styles.preferenceItem}>
        <label>Interests</label>
        <div className={styles.interestsContainer}>
          {availableInterest.map((item) => (
            <label key={item} className={styles.interestCheckbox}>
              <input
                type="checkbox"
                checked={interest?.includes(item)}
                onChange={() => handleInterestChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

   {/* Save Button */}
   <button className={styles.saveButton} onClick={handleSearch}>
        Search Preferences
      </button>





 {/* Display Matching Profiles */}







    </div>
    {profiles.length > 0 && (
        <div >
          <h3 className={styles.Heading}>Matching Profiles</h3>
          <ul className={styles.SearchPageContainer}>            {profiles.map((profile,index) => (
              <SwipeCard key={index} profile={profile}/>
            ))}
          </ul>
        </div>
      )}
    </> )
}

export default SearchPage