import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) navigate("/chats");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    //container diff media size working 
    //all the props there in document 
    <Container maxW="xl" centerContent>
      {/* //no need to take care of css just send in the prop it will automatically take  */}
      <Box
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text display="flex" fontSize="4xl" fontFamily="Montserrat">
          ChatCord
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        {/* //login signup  */}
        <Tabs isFitted variant="soft-rounded" colorScheme="whatsapp">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
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

export default HomePage;
