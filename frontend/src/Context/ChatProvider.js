import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const [notificationSender, setNotificationSender] = useState([])
    const [latestMessage, setLatestMessage] = useState()
    const naviagte = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo);

        if (!userInfo) {
            naviagte('/');
        }
        else {
            naviagte('/chats');
        }
    }, [])

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, notificationSender, setNotificationSender, latestMessage, setLatestMessage }}>{children}</ChatContext.Provider>
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;