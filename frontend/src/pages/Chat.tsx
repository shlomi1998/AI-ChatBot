import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import  { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Message = {
  role: string; // Role can be 'user' or 'ai'
  content: string; // The message content
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = {
      role: "user",
      content,
    };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
  useEffect(() => {
   if(!auth?.user) {
    return navigate('/login');
   }
  },[])
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1]?.[0]}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
          onClick={ handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - GPT 4
        </Typography>
        <Box
          sx={{
            
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
            eight: { xs: "90%", md: "60vh" }, // Adjust height based on screen size
            "@media screen and (max-width: 600px)": {
              height: "90%", // Set height to 90% when screen width is under 600px
            },
            '@media screen and (max-width: 400px)': {
              height: '80%', 
            },
          }}
        >
          {chatMessages.map((chat, index) => (
            //@ts-ignore
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            background: "rgb(17,29,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              borderRadius: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
              border: "none",
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{ mx:1, color: "white" }}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
