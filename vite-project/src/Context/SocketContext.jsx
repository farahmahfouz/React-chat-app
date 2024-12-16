import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";



const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });
            socket.current.on("connect", () => {
                console.log(`Connected to socket server`);
            });

            const handleRecieveMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage, addContactInContactsList } = useAppStore.getState();
                if (selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id
                        || selectedChatData._id === message.reciever._id)) {
                    addMessage(message)
                }
                addContactInContactsList(message);
            };
            const handleRecieveChannelMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage, addChannelInChannelsList } = useAppStore.getState();
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }
                addChannelInChannelsList(message);
            };

            socket.current.on('recieveMessage', handleRecieveMessage);
            socket.current.on('recieve-channel-message', handleRecieveChannelMessage);

            return () => {
                socket.current.disconnect();
            }
        }
    }, [userInfo])
    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}
