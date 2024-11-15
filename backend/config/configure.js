const mongoose = require('mongoose');

const connection = async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI, {
        connectTimeoutMS: 20000, // Timeout after 10 seconds if unable to connect
        serverSelectionTimeoutMS: 45000, // Wait 5 seconds for primary replica set to be reachable
      });
       console.log(`Database connected`);

    } catch (error) {
        console.log(`error in db connection: `,error);
    }
}

connection();





