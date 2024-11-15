const express = require('express');
const auth = require('../middleware/auth.middleware');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Matches = require('../models/Matches');
const User = require('../models/User');

const router = express.Router();
router.use(auth);


router.get('/',async(req,res)=>{
    try {
    const userId = req.user?.id;

    const allData = await User.find({_id:{$ne:userId}}); 
    // console.log(allData);
    res.status(200).json(allData);


    } catch (error) {
        console.error("Error fetching profiles: ",error);
        res.status(500).send({message:"Internal server error"})
    }
});

router.post('/find',async(req,res)=>{
    const {searchKeyword} = req.body;
    if(!searchKeyword){
        return res.status(411).json({message:"No search keyword present"});
    }
    try {
        console.log("SearchKeyword is ",searchKeyword);
       
            const userId = req.user?.id;
            const allData = await User.find({
                _id: { $ne: userId }, // Exclude the current user
                name: { $regex: searchKeyword, $options: "i" } // Case-insensitive search
            });
    
            res.status(202).json(allData);
        
        
    } catch (error) {
        
        console.error("Error Searching profiles: ",error);
        res.status(500).send({message:"Internal server error"})
    }
})

router.post('/swipe',async(req,res)=>{
    const {match,action} = req.body;
    const userId = req.user?.id;
    console.log("userId , match , action",userId,match,action);
try {
    if(action ==="like"){
        let swipeDoc = await Swipe.findOne({user:userId});

    
    if(!swipeDoc){
        swipeDoc = await Swipe.create({
            user:userId,
            targetUserId:[match]
        })

    }else if(!swipeDoc.targetUserId.includes(match)){
        swipeDoc.targetUserId.push(match);
        await swipeDoc.save();
    }

    const tempcheck = await Swipe.findOne({
        user:match

    });
    if(tempcheck && tempcheck.targetUserId.includes(userId) ){
        await Matches.create({
            user1:userId,
            user2:match
        })
    }

    res.status(200).send({message:"Swipe recorded successfully"});
}

    else{
    res.status(200).send({message:"Swipe action ignored"});

    }
} catch (error) {
    console.error('Error recording swipe:', error);
    res.status(500).send({ message: 'Internal server error' });
}
    

})

router.post('/search',async(req,res)=>{
    try {
        const { ageRange, gender, interest, lookingFor } = req.body;

        const query = {};

        if (ageRange) {
          query['age'] = { $gte: ageRange[0], $lte: ageRange[1] };
        }
    
        if (gender) {
          query['gender'] = gender;
        }
    
        if (interest && interest.length > 0) {
          query['interest'] = { $in: interest };
        }
    
        if (lookingFor) {
          query['lookingFor'] = lookingFor;
        }
    console.log("query is ",query);
      
    const matchingProfiles = await User.find(query);
    
 

        console.log(matchingProfiles);

        res.status(202).json(matchingProfiles);

    } catch (error) {
        console.error(error);
    res.status(500).send('Error fetching profiles');
    }
})

module.exports = router;