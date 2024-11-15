const express = require('express');
const router = express.Router();
const {Chat} = require('../models/ChatSchema');
// const io = require('../server');
const auth = require('../middleware/auth.middleware');
const getObjectId = require('../utils/getObjectId');
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const multer = require("multer");




router.use(auth);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/all',async(req,res)=>{
    console.log("get all request hit");
    try{
        const user = req?.user?.id;
        const response = await Chat.find({
            participants: user,
        }).populate({
            path:"participants",
            select:"name profilePicture",
            match: { _id: { $ne: user } } 
        }).sort({ updatedAt: -1 });
        console.log("response is : ",response);
        return res.status(202).json(response)
    }catch(error){
console.log("Error while fetching all chats: ",error);
res.status(500).json({message:"Server Error"});
    }
})

router.get('/:userId/:receiverId',async(req,res)=>{
    try {
        let {userId,receiverId} = req.params;
        if (!userId || !receiverId) {
            return res.status(400).json({ message: "Sender and receiver IDs are required." });
        }

        // console.log("user1Id,user2Id befor getObjectId are:  ",userId,receiverId);


        const userId1 = getObjectId(userId);
        const userId2 = getObjectId(receiverId);

        // console.log("user1Id,user2Id are:  ",userId1,userId2);
        
        const chat = await Chat.findOne({
            participants:{$all:[userId1,userId2]},
        }).populate('message','name');

        res.status(200).json(chat?chat.message:[]);
    } catch (error) {
        console.error('Error fetching chat message: ',error);
        res.status(500).json({message:"Error fething chat message"})
    }
})

router.post('/message',async(req,res)=>{
    let {sender , receiver , text} = req.body;

    // console.log("sender , receiver , text in post request : ",sender,receiver,text);
    
    if (!sender || !receiver) {
        return res.status(400).json({ message: "Sender and receiver IDs are required." });
    }
    // console.log("sender and receiver in chatRoute.js",sender,receiver);

     sender = getObjectId(sender);
     receiver = getObjectId(receiver);


    try {
        let chat = await Chat.findOne({participants:{
            $all:[sender,receiver]
        }});
        if(!chat){
            chat = new Chat({participants:[sender,receiver],message:[]});
        }
        const message = {sender,text};
        chat.message.push(message);
        await chat.save();

        req.app.get('io').to(sender).emit('newMessage',message);
        req.app.get('io').to(receiver.toString()).emit('newMessage',message);

        res.status(201).json(message);
    } catch (error) {
        console.error("Error saving message: ",error);
        res.status(500).json({message:"Error saving message"});
    }
})

router.post("/upload",upload.single("file"),async(req,res)=>{
try {
    const {sender , receiver,text} = req.body;
    let fileUrl = "";
    if (req.file) {
        fileUrl = await uploadToCloudinary(
          req.file.buffer,
          "user_profiles"
        );
      }

      const chat = await Chat.findOneAndUpdate({participants:{$all:[sender,receiver]}},{
        $push:{
            message:{
                sender,text,mediaUrl:fileUrl,timestamp:new Date()
            }
        }
      },{new : true, upsert:true});

      res.status(200).json(chat);


} catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
}
})

router.get("/search/:userId/:receiverId",async(req,res)=>{
    const {userId, receiverId} = req.params;
    const {keyword} = req.query;

    try{
        const chat = await Chat.findOne({
            participants:{$all:[userId,receiverId]}
        });
        if(!chat){
            return res.status(404).json({message:"Chat not found"});
        }
        const message = chat.message.filter((msg)=>msg.text.toLowerCase().includes(keyword.toLowerCase()) && msg.isDeleted === false);

        return res.status(200).json(message);
    }catch(error){
        console.error("Error searching messages:", error);
        return res.status(500).json({ message: "Error searching messages" });
    }
})


module.exports = router;














