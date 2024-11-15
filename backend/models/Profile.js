const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    bio:{
        type:String,
        default:"",
    },
   
    profilePicture:{
        type:String,
        default:""
    },
    lookingFor:{
        type:[String],
        default:[]
    }
},{timestamps:true,strict:false})

const Profile = mongoose.model('Profile',profileSchema);

module.exports = Profile;
