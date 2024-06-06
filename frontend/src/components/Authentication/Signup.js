import { Button,FormControl, FormLabel, VStack,Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import React,{useState } from 'react'
import { useNavigate } from "react-router";

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [showc,setShowc]=useState(false);
    const [picLoading,setPicLoading]=useState(false);
    const toast=useToast();
    const navigate=useNavigate();
    const handleClick=()=>setShow(!show);
    const handleClickc=()=>setShowc(!showc);

    //saving out data in the database.
    const submitHandler = async (e) => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      e.preventDefault(); 
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }


try {
            const response = await fetch("api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name,
                      email,
                      password,
                      pic, })
            });
            const data = await response.json();
            console.log(data);
            toast({
              title: "Registration Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            navigate("/chats")
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  //uploading an image which signup
  const postDetails = (pics) => {
    setPicLoading(true);
    
    // if file uploaded is not there
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    console.log(pics);

    //only if its a jped or png file
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();   //creating a new data in which we add the necessary details like app name, cloud name and the file.
      data.append("file", pics);
      // chat-app
      data.append("upload_preset", "chatcord");
      // dkmlrqfug
      data.append("cloud_name", "dkfowp1yq");
      //sending the api request of post
      fetch("https://api.cloudinary.com/v1_1/dkfowp1yq/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json()) // converting the response to json file
        .then((data) => {
          // setting our pic state to the url.
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };


  return (

    //vertical stack in chakra ui 
    <VStack spacing='5px' color='black'>


        <FormControl id="first-name" isRequired>
            <FormLabel>Name
            </FormLabel>
                <Input 
                    placeholder='Enter your name '
                    onChange={(e)=>setName(e.target.value)}
                />
        </FormControl>


        <FormControl id="email" isRequired>
            <FormLabel>Email
            </FormLabel>
                <Input 
                    type={"Email"}
                    placeholder='Enter your email '
                    onChange={(e)=>setEmail(e.target.value)}
                />
        </FormControl>


        <FormControl id="password" isRequired>
            <FormLabel>Password
            </FormLabel>
            <InputGroup>
                <Input 
                type={show?"text":"password"}
                    placeholder='Enter Password '
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show?"Hide":"Show"}
                  </Button>
                </InputRightElement> 
            </InputGroup>
        </FormControl>


        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password
            </FormLabel>
            <InputGroup>
                <Input 
                type={showc?"text":"password"}
                    placeholder='Enter Password '
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClickc}>
                    {showc?"Hide":"Show"}
                  </Button>
                </InputRightElement> 
            </InputGroup>
        </FormControl>


        <FormControl id="pic" >
            <FormLabel>Upload your Picture
            </FormLabel>
                <Input 
                    type={"file"}
                    p={"1.5"}
          accept="image/*"
          //only first image we will take so if user take multiple image we will take first
                    onChange={(e)=>postDetails(e.target.files[0])}
                />
        </FormControl>

        <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 15 }}
         isLoading={picLoading}
         onClick={submitHandler}
      >
        Sign Up
      </Button>

    </VStack>
  )
}

export default Signup