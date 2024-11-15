import React, { useEffect, useState } from 'react'
import styles from "./MatchPage.module.css"
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContextProvider';
import Sidebar from '../homeComponent/Sidebar';

function MatchPage() {
    const [matches,setMatches] = useState([]);
    const navigate = useNavigate();
    const {getMatches,getToken,userProfile} = useAuthContext();

    useEffect(()=>{
        if(!getToken()){
            return navigate('/login')
        }

       try {
        const fetchmatches = async ()=>{
            const response = await getMatches();
            console.log("response data is matchpage ",response.data);
            setMatches(response.data);
        }
        fetchmatches();
       } catch (error) {
        console.log("Error in fetching matches in matchcard: ",error)
       }
    },[]);

    const handleChatClick = (receiverId)=>{
        navigate(`/chat/${receiverId}`);
    }

  return (
<>
<div className={styles.matchPageContainer}>
    <h1>Your Matches</h1>
    <div className={styles.matchList}>
        {matches && matches?.length>0 ? ( matches.map((match,index)=>(
           
            <div key={index} className={styles.matchCard}>
                <img src={match?.user?.profilePicture || "https://www.w3schools.com/w3images/avatar2.png"} alt={match.user?.name} />
                <h5>{match?.user?.name},{match?.user?.age}</h5>
                <button onClick={()=>handleChatClick(match?.user?._id)} >Chat</button>
            </div>

))):(<>
        <div className={styles.noMatches}>No Matches Found. </div>
    

        </>
            
        )
    }
    </div>
</div>
</>  )
}

export default MatchPage