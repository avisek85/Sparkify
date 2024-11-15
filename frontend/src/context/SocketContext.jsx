import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = ()=>useContext(SocketContext);

export const SocketProvider = ({children})=>{
    const [socket , setSocket] = useState(null);
    useEffect(()=>{
        const socketConnection = io("http://localhost:3000");
        setSocket(socketConnection);

        return ()=>socketConnection.disconnect();
    },[]);

    return(<>
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
    </>)
}

