import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Button, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react';
import { Box } from "@chakra-ui/layout";
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import Lottie from "react-lottie";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
const ENDPOINT = "https://message-mate.onrender.com";   //Endpoint of the backend

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  let [typing, setTyping] = useState(false);
  let [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  let {user,selectedChat,setSelectedChat, notification, setNotification,chats,setChats}= ChatState();

  const fetchMessages = async () => {
    //const c=user;user=localStorage.getItem("userInfo");
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
      ///console.log(data);
      socket.emit("join chat", selectedChat._id); // join room with this chat id
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    
    socket.emit("setup", JSON.parse(localStorage.getItem("userInfo"))); //joins the room id
    //socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true)); //connection is established
    console.log(socketConnected);
    socket.on("typing", () => setIsTyping(true));
    //let k=istyping;istyping=k;
    socket.on("stop typing", () => setIsTyping(false));
    //k=istyping;istyping=k;
   // console.log(istyping);
    //console.log("yaha");
    // eslint-disable-next-line
  }, []);




  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      //k=istyping;istyping=k;
      console.log(istyping);
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
      //console.log(data);
        setMessages([...messages, data]);
        //console.log(selectedChat);
        // /console.log(messages);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // to handle when we recieve a message from a user....we want to update our char in live
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat then we just give notification
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  console.log(notification);
    const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      //console.log(typing);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        //console.log(typing);
      }
    }, timerLength+100);
  };


  const deleteChat=async ()=>{
    try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const user2=await JSON.parse(localStorage.getItem("userInfo"));
        const { data } = await axios.put(
          "/api/chat/chatremove",
          {
            userId: user2._id,
            chatId: selectedChat
          },
          config
        );
        const updatedChats = chats.filter(chat => chat._id !== selectedChat._id);
        setChats(updatedChats);
        setSelectedChat("");
        
        toast({
          title: "Succesfully deleted",
          duration: 5000,
          status:'success',
          isClosable: true,
          position: "bottom",
        });
    } catch (error) {
      toast({
          title: "Error Occured!",
          description: "Failed to delete the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
  }
  
  return (
    <>
         {selectedChat ? (<>
            <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >

          {/* when we are having smaller screen arrow back icon is there to go back by emptying the selected chat */}
          <IconButton
              display={{ base: "flex",md:"none"}}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("")
                }}
            />
            {!selectedChat.isGroupChat?(<>
                {getSender(user,selectedChat.users)}
                <Button leftIcon={<DeleteIcon/>}  colorScheme='teal' variant='solid'
                 onClick={deleteChat}>
                  Delete Chat
                </Button>
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
            </>):(<>
                {selectedChat.chatName.toUpperCase()}
                
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
            </>)}
          </Text>
          <Box
            display="flex"
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
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            
              <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
            {istyping ? (
                <div>
                <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>

          </Box>
         </>)
         :
          (<Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>) }
    </>
  )
}

export default SingleChat
