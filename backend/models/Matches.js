const mongoose = require('mongoose')

const matchesSchema = new mongoose.Schema({
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    user2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }

},{timestamps:true})

const Matches = mongoose.model('Match',matchesSchema);
module.exports = Matches;