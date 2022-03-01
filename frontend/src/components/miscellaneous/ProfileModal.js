import { Button, Image, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { IconButton } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}></IconButton>
            )}
            <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered initialFocusRef finalFocusRef>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'40px'}
                        d='flex'
                        justifyContent={'center'}
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        d='flex'
                        flexDir={'column'}
                        alignItems='center'
                        justifyContent={'space-between'}
                    >
                        <Image
                            borderRadius={'full'}
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: '20px', md: '30px' }}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal