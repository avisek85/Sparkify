const cloudinary = require('../config/clodinaryConfig'); 

const uploadToCloudinary = (fileBuffer,folder)=>{
    return new Promise((resolve, reject) => {
        if(!fileBuffer){
           return reject(new Error("No fileBuffer provided for uploading"));
        }
        const uploadStream = cloudinary.uploader.upload_stream(
            {folder},
            (error,result)=>{
                if(error){
                    console.log("Loudinary upload error: ",error);
                    return reject(new Error("Cloudinary upload failed"));
                }
                resolve(result.secure_url);
            }
        );
        uploadStream.end(fileBuffer);
    })
}


module.exports = uploadToCloudinary;


// const uploadToCloudinary = async(fileBuffer,folder)=>{
//     if(!fileBuffer){
//         throw new Error("No file buffer provided for upload");
//     }
// try {
//     const result = await cloudinary.uploader.upload(fileBuffer,{folder});
//     return result.secure_url;
// } catch (error) {
//     console.error("Cloudinary upload error: ", error);
//     throw new Error("Cloudinary upload failed");
// }
// }
