import React, { useEffect } from "react";
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import Login from "./../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/login");
    }
  }, []);

  return (
    <Container maxW="container.lg" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        margin="40px 0 15px 0"
        borderRadius="30px"
        borderWidth="1px"
      >
        <Text fontSize="5xl"> Chatter's Yard </Text>
      </Box>

      <Box p={4} bg={"white"} w="100%" borderRadius="30px" borderWidth="1px">
        {/* Tabs for SignIn and SignUp */}
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" fontSize="2xl">
              Login
            </Tab>
            <Tab width="50%" fontSize="2xl">
              Signup
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
