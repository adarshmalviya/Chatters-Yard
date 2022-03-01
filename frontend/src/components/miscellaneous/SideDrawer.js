import React from 'react'
import { useState } from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { Avatar, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, useDisclosure } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/layout';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from './../UserAvatar/UserListItem';
import { useToast } from '@chakra-ui/react';
import { getSender } from './../../config/ChatLogics';
import Effect from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loding, setLoding] = useState(false);
    const [lodingChat, setLodingChat] = useState();
    const { user, setSelectedChat, chats, setChats, notification, setNotification, notificationSender, setNotificationSender } = ChatState();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/')
    }

    const handleSearch = async (query) => {
        setSearch(query)

        if (!query) { setSearchResult([]); return }
        try {
            setLoding(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);

            setSearchResult(data);
            setLoding(false);
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    const accessChat = async (userId) => {
        try {
            setLodingChat(true)

            const config = {
                headers: {
                    "Content-type": 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('/api/chat', { userId }, config)

            if (!chats.find((c) => c._id === data._id)) { setChats([data, ...chats]) }
            setSelectedChat(data);
            setLodingChat(false)
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            console.log("Error->", error)
            setLodingChat(false)
        }
    };

    return (
        <>
            <Box
                d='flex'
                justifyContent={'space-between'}
                alignItems='center'
                bg={'white'}
                w='100%'
                p={'5px 10px 5px 10px'}
                borderWidth='5px'
            >
                <Tooltip label='Search Users to Chat' hasArrow placement='bottom-end'>
                    <Button variant={'ghost'} onClick={onOpen}>
                        <i className='fas fa-search'></i>
                        <Text d={{ base: 'none', md: 'flex' }} px='4'>
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={'2xl'}>Chatter's Yard</Text>

                <div>
                    <Menu autoSelect={false}>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize={'2xl'} m='1' />
                        </MenuButton>
                        <MenuList>
                            {!notification.length && <MenuItem cursor={'inherit'}> No New Messages </MenuItem>}
                            {notification.map((notif) => {
                                return (<MenuItem key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif));
                                    setNotificationSender(notification.filter((n) => n.sender._id !== notif.sender._id))
                                }}>
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>)
                            })}
                        </MenuList>
                    </Menu>

                    <Menu autoSelect={false}>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic}></Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box d={'flex'} mb='1.5'>
                            <Input placeholder='Search by Name or Email' mr={2} value={search} onChange={(e) => { handleSearch(e.target.value) }} />
                            <Button>Go</Button>
                        </Box>
                        {loding ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map(user => {
                                return <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />

                            })
                        )}
                        {lodingChat && <Spinner m={'auto'} d='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer