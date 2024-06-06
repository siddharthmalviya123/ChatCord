import React, { useState,useEffect } from 'react'
import { Box ,Flex} from "@chakra-ui/layout";
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  
  const user=JSON.parse(localStorage.getItem("userInfo"));
  const [fetchAgain, setFetchAgain] = useState(false);

  //console.log(user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        )}
      </Box>
      {/* <Flex>
      <Box flex='0.5' justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats/>}</Box>
        <Box flex='0.5' justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && (
          <ChatBox/>
        )}
      </Box>
      </Flex> */}
    </div>
  )
}

export default ChatPage