import React from 'react'
import { ChatState } from './../Context/ChatProvider';
import { useToast } from '@chakra-ui/toast';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Box, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { Stack } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/layout';
import { getSender } from './../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
import ScrollableFeed from 'react-scrollable-feed'


const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setloggedUser] = useState()
    const { user, selectedChat, setSelectedChat, chats, setChats, latestMessage, setLatestMessage } = ChatState()

    const toast = useToast();
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/chat', config)
            setChats(data);
        } catch (error) {
            console.log('Error:-> ', error)
        }
    }

    useEffect(() => {
        setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain])

    useEffect(() => {
        if (latestMessage) {
            var updated_chat = [...chats]
            updated_chat.filter((ele) => {
                if (ele._id == latestMessage.chat._id) {
                    if (!ele.latestMessage) {
                        ele.latestMessage = latestMessage
                    }
                    else {
                        ele.latestMessage.content = latestMessage.content;
                        ele.latestMessage.sender.name = latestMessage.sender.name;
                    }
                }
                return ele

            })
            setChats(updated_chat);
        }
    }, [latestMessage])

    return (
        <Box
            d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir='column'
            alignItems={'center'}
            p={3}
            bg='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                d='flex'
                w={'100%'}
                justifyContent='space-between'
                alignItems={'center'}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        d='flex'
                        fontSize={{ base: '17px', md: '10px', 'lg': '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                d='flex'
                flexDir={'column'}
                p={3}
                bg='#F8F8F8'
                w={'100%'}
                h={'100%'}
                borderRadius='lg'
                overflowY={'hidden'}
            >
                {chats ? (
                    <ScrollableFeed>
                        <Stack>
                            {chats.map((chat) => {
                                return (
                                    <Box
                                        onClick={() => { setSelectedChat(chat) }}
                                        cursor='pointer'
                                        bg={selectedChat === chat ? '#38B2AC' : '#d3e2ed'}
                                        color={selectedChat === chat ? 'white' : 'black'}
                                        px={3}
                                        py={2}
                                        borderRadius='lg'
                                        key={chat._id}
                                    >
                                        <Text fontSize={'2xl'}>{!chat.isGroupChat && loggedUser ? getSender(loggedUser, chat.users) : chat.chatName} </Text>
                                        {chat.latestMessage ? <Text ><b> {chat.latestMessage.sender.name}</b>  : {chat.latestMessage.content} </Text> : null}
                                    </Box>
                                )
                            })}
                        </Stack>
                    </ScrollableFeed>

                ) : (<ChatLoading />)}
            </Box>
        </Box>
    )
}

export default MyChats