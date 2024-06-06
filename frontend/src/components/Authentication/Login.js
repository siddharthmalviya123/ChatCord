import { Button,FormControl, FormLabel, VStack,Input, InputGroup, InputRightElement,useToast } from '@chakra-ui/react'
import React,{useState } from 'react'
import { useNavigate } from "react-router";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast=useToast();
    const navigate=useNavigate();
  const handleClick = () => setShow(!show);
  
  
    const submitHandler = async (e) => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
      e.preventDefault();
      const response = await fetch("api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email,password })
        });
        const data = await response.json();
        //console.log(data);
        if (data.success) {
              console.log(data.success);
              toast({
              title: "Login Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            //console.log(localStorage.getItem("userInfo"));
            setLoading(false);
            navigate("/chats")
        } else {
            toast({
              title: "Error Occured!",
              description: "Invalid",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
        }
  };


  return (
    <VStack spacing='5px' color='black'>
        <FormControl id="email" isRequired>
            <FormLabel>Email
            </FormLabel>
                <Input 
                value={email}
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
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show?"Hide":"Show"}
                  </Button>
                </InputRightElement> 
            </InputGroup>
        </FormControl>


        <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        >
          Login
        </Button>


      <Button
        variant="solid"
        colorScheme="blue"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>

      
    </VStack>
  )
}

export default Login