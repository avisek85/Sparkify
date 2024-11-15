import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = ()=>useContext(SocketContext);

export const SocketProvider = ({children})=>{
    const SOCKET_URI  = import.meta.env.VITE_SOCKET_URI;

    const [socket , setSocket] = useState(null);
    useEffect(()=>{
        const socketConnection = io(`${SOCKET_URI}`);
        setSocket(socketConnection);

        return ()=>socketConnection.disconnect();
    },[]);

    return(<>
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
    </>)
}

