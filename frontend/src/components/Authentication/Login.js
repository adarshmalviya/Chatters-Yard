import React from 'react'
import { useState } from 'react';
import { VStack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import {
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ChatState } from './../../Context/ChatProvider';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loding, setLoding] = useState(false)
    const navigate = useNavigate()
    const toast = useToast();
    const { setUser } = ChatState()

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)
    const submitHandler = async () => {
        setLoding(true);
        if (!email | !password) {
            toast({
                title: "Please fill all details!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoding(false);
            return
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };

            const { data } = await axios.post('/api/user/login',
                { email, password },
                config
            );

            toast({
                title: "Login Successful",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            localStorage.setItem('userInfo', JSON.stringify(data))
            setUser(data);

            setLoding(false);
            navigate('/chats');
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoding(false);
        }
    };

    return (
        <VStack>
            <FormControl className='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Enter Your Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
            </FormControl>

            <FormControl className='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme='blue' width='80%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loding}>Login</Button>
            <Button id='guest-login-btn' colorScheme='red' width='80%' onClick={() => { setEmail('guest@guest.com'); setPassword('12345') }}>Guest Credentials</Button>
        </VStack>
    )
}

export default Login