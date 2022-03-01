import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import { FormControl } from '@chakra-ui/form-control';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from './../UserAvatar/UserBadgeItem';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { ChatState } from './../../Context/ChatProvider';
import { Box } from '@chakra-ui/layout';


const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post('/api/chat/group',
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(u => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            toast({
                title: "Failed to Create the Chat",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
        }
    };
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={'35px'} d='flex' justifyContent={'center'}>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d='flex' flexDir={'column'} alignItems='center'>
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users eg. Adarsh, John, Hane' mb={3} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        <Box w={'100%'} d='flex' flexWrap={'wrap'}>

                            {selectedUsers.map((u) => (
                                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>

                        {loading ? <Spinner /> : (
                            searchResult?.slice(0, 4).map(user => {
                                return <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal