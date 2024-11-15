const mongoose = require('mongoose')

function getObjectId(id){
   try {
    if(mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id){
        return id;
    }
    else{
        return new mongoose.Types.ObjectId(id);
    }
   } catch (error) {
    console.log("Error in converting id received from frontend: ",error);
   }
}

module.exports = getObjectId;