import { jwtDecode } from 'jwt-decode'; 
function decodeJsonWebToken(token){
    try{
        const decoded = jwtDecode(token);
        // console.log("decoded value: ",decoded);
        return decoded?.id || null;
    }catch(error){
        console.error("Error decoding token:",error);
        return null;
    }
} 

export default  decodeJsonWebToken;


