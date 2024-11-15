const { default: mongoose } = require("mongoose");
const {Chat,MessageModel} = require("./models/ChatSchema");
const getObjectId = require("./utils/getObjectId");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected: ", socket.id);

    socket.on("joinChat", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async (data) => {
      let { sender, receiver, text } = data;

      if (!sender || !receiver) {
         console.log( "Sender and receiver IDs are required." );
         return;
    }

      sender = getObjectId(sender);
      receiver = getObjectId(receiver);

      try {
        let chat = await Chat.findOne({
          participants: { $all: [sender, receiver] },
        });

        if (!chat) {
          chat = new Chat({ participants: [sender, receiver], message: [] });
        }

        const tempmessage = { sender, text };
        chat.message.push(tempmessage);
        await chat.save();


        
        io.to(sender.toString()).emit("allchats", chat.message);
        io.to(receiver.toString()).emit("allchats", chat.message);
        
        io.to(sender.toString()).emit("reviseList","Done");
        io.to(receiver.toString()).emit("reviseList","Done");



        // io.to(sender.toString()).emit("newMessage", tempmessage);
        // io.to(receiver.toString()).emit("newMessage", tempmessage);
      } catch (error) {
        console.error("Error saving message: ", error);
      }
    });

    socket.on("deleteMessage",async({messageId,sender,receiver})=>{
      if(!messageId){
        console.log("messageId required");
        return;
      }

      console.log("ids in delete function: ",messageId,sender,receiver);

      messageId = getObjectId(messageId);
      sender = getObjectId(sender);
      receiver = getObjectId(receiver);

      console.log("ids in delete function: ",messageId,sender,receiver);


      try {
        // const updatedMessage = await MessageModel.findOneAndUpdate({_id:new mongoose.Types.ObjectId(messageId)},{$set:{
        //   isDeleted:true,
        // }},{new:true})

        let chat = await Chat.findOne({
          participants: { $all: [sender, receiver] },
          "message._id": messageId,
        });

        if (!chat) {
          console.log("No chat found with the given participants and message Id");
          return;
        }

        const message = chat.message.id(messageId);
        if (message) {
          message.isDeleted = true; // Set isDeleted to true
        }

        await chat.save();
  
        // if(!updatedMessage){
        //   console.log("No message found with the given  message Id");
        //   return null;
        // }
        console.log("Message mark as deleted",message);
        
        
              io.to(sender.toString()).emit("allchats", chat.message);
              io.to(receiver.toString()).emit("allchats", chat.message);
      } catch (error) {
        console.error('Error updating message:', error);
      }

    })

    socket.on("sendMediaMessage",async({messageData,userId,receiverId})=>{
      try {
        io.to(userId.toString()).emit("allchats", messageData.message);
        io.to(receiverId.toString()).emit("allchats", messageData.message);
      } catch (error) {
        console.error("Error sending media message:", error);
      }
    })



    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
};

module.exports = setupSocket;




