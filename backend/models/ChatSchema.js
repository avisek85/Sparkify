const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { 
    type: String, 
    index: "text" 
},
  mediaUrl: {
    type: String, // Stores the file URL if it’s a media message
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  message: [messageSchema],
},{timestamps:true});

const Chat = mongoose.model("Chat", chatSchema);
const MessageModel = mongoose.model("MessageModel", messageSchema);

module.exports = { Chat, MessageModel };
