import React from 'react'
import { ChatState } from './../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { Icon, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from './../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { useState } from 'react';
import { FormControl } from '@chakra-ui/form-control';
import axios from 'axios';
import { useEffect } from 'react';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import { RiSendPlaneFill } from 'react-icons/ri'
import animationData from '../annimations/typing_annimation.json'

const ENDPOINT = 'https://chattersyard.herokuapp.com/';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    const toast = useToast()
    const { user, selectedChat, setSelectedChat, notification, setNotification, notificationSender, setNotificationSender, setLatestMessage } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    }
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages();
        if (selectedChatCompare) {
            socket.emit('leave', selectedChatCompare._id)
        }
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

                if (!notificationSender.includes(newMessageRecieved.sender._id)) {
                    setNotificationSender([newMessageRecieved.sender._id, ...notificationSender])
                    setNotification([newMessageRecieved, ...notification])
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
            setFetchAgain(!fetchAgain);
            setLatestMessage(newMessageRecieved)
        })

    })


    const sendMessage = async () => {
        if (newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
                setLatestMessage(data);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            }
        }
    }



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id);
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false);
            }
        }, timerLength)
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        d="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName}
                                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}
                            </>
                        )}
                    </Text>
                    <Box
                        d="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size={'xl'}
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin={'auto'}
                            />) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <form onSubmit={(e) => { e.preventDefault(); sendMessage() }}>
                            <FormControl isRequired mt={3}>
                                {isTyping ? <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div> : <></>}
                                <Box d='flex'>
                                    <Input
                                        variant={'ghost'}
                                        bg='white'
                                        placeholder='Enter a message...'
                                        onChange={typingHandler}
                                        value={newMessage}

                                    />
                                    <Icon as={RiSendPlaneFill} w={6} h={6} ml={2} mt={2} color='black' onClick={sendMessage} cursor='pointer' />
                                </Box>
                            </FormControl>
                        </form>
                    </Box>
                </>) : (
                <Box d='flex' alignItems='center' justifyContent='center' h='100%'>
                    <Text fontSize='3xl' pb={3}>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat