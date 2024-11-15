const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    targetUserId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{timestamps:true});


const Swipe = mongoose.model("swipe",swipeSchema);

module.exports = Swipe;