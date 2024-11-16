const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    actions: [
        {
          targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          action: { type: String, enum: ['like', 'dislike'], required: true },
        },
      ],
    
},{timestamps:true});


const Swipe = mongoose.model("swipe",swipeSchema);

module.exports = Swipe;