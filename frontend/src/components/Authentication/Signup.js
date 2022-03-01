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


const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [pic, setPic] = useState()
    const [loding, setLoding] = useState(false)
    const navigate = useNavigate()
    const toast = useToast();
    const { setUser } = ChatState()

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoding(true);
        if (pics === undefined) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoding(false);
            return
        }

        if (pics.type.substring(0, 5) !== "image") {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoding(false);
            return
        }

        // Uploading Image to cloud
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chatty");
        fetch("https://api.cloudinary.com/v1_1/adarsh-cloud/image/upload/", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.secure_url.toString());
                setLoding(false)
            })
            .catch((err) => {
                console.log(err)
                setLoding(false)
            });
    };
    const submitHandler = async () => {
        setLoding(true)
        if (!name | !email | !password) {
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

            const { data } = await axios.post('/api/user',
                { name, email, password, pic },
                config
            );

            toast({
                title: "Registration Successful",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input type='text' placeholder='Enter Your Name' onChange={(e) => { setName(e.target.value) }} />
            </FormControl>

            <FormControl className='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Enter Your Email' onChange={(e) => { setEmail(e.target.value) }} />
            </FormControl>

            <FormControl className='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your password'
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic'>
                <FormLabel>Upload Profile Picture</FormLabel>
                <Input type='file' accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>

            <Button colorScheme='blue' width='80%' style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loding}>Sing Up</Button>
        </VStack>
    )
}

export default Signup