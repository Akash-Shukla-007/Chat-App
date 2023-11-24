import { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatContext";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import getSender, { getFullSenderUser } from "../../helper/chatSender";
import ProfileModal from "./Modal/ProfileModal";
import EditGroupModal from "./Modal/EditGroupModal";
import { fetchAllMessages, sendMessages } from "../../services/httpServices";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import amitmationData from "../../lotties/Typing.json";

// var ENDPOINT = "http://localhost:8000";
var ENDPOINT = "https://chat-app-server-fhl6.onrender.com";
var socket: any, selectedChatCompare: any;

function SingleChat() {
  const toast = useToast();
  const {
    selectedChat,
    user,
    setSelectedChat,
    notifications,
    setNotifications,
  }: any = ChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connection");
    socket.emit("setup", user);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
  }, []);
  // console.log(selectedChat);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await fetchAllMessages({ chatId: selectedChat._id });
      // console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join-room", selectedChat);
    } catch (error: any) {
      // console.log(error.message);
    }
  };
  // useEffect(() => {

  // }, [socket]);

  useEffect(() => {
    socket.on("recieved-message", (recievedMessage: any) => {
      if (
        !selectedChatCompare ||
        recievedMessage.chat._id !== selectedChatCompare._id
      ) {
        if (!notifications?.includes(recievedMessage)) {
          setNotifications((pre: any) => {
            return [recievedMessage, ...pre];
          });
        }
      } else {
        setMessages((pre: any) => {
          return [...pre, recievedMessage];
        });
      }
    });

    return () => socket.off("recieved-message");
  }, [socket]);

  const sendMessage = async (e: any) => {
    if (e.key === "Enter") {
      socket.emit("stop-typing", selectedChat._id);
      if (newMessage == "")
        return toast({ title: "Empty message not Allowed", status: "warning" });

      try {
        const { data } = await sendMessages({
          chatId: selectedChat._id,
          content: newMessage,
        });
        // console.log(data);
        socket.emit("new-message", data);
        setNewMessage("");
        setMessages([...messages, data]);
        // console.log("socket Conectyed  -> ", socketConnected);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    var lastTypingTime = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      // console.log(timeDiff >= 3000, typing);
      if (timeDiff >= timer && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timer);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(" ------------------------> ", notifications);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: amitmationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {/* {Object.keys(selectedChat).length !== 0 ? <h1>yes</h1> : <h1>NO</h1>} */}
      {Object.keys(selectedChat).length !== 0 ? (
        <Box
          w={"100%"}
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          gap={2}
        >
          <Box
            w={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <IconButton
              aria-label="Back Button"
              icon={<ArrowBackIcon />}
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat({})}
            />
            <Text fontWeight={"bold"} ml={4}>
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users)}
            </Text>

            {selectedChat.isGroupChat ? (
              <EditGroupModal />
            ) : (
              <ProfileModal user={getFullSenderUser(user, selectedChat.users)}>
                <IconButton icon={<ViewIcon />} aria-label="View Profile" />
              </ProfileModal>
            )}
          </Box>
          <Box
            display={"flex"}
            width={"100%"}
            height={"95%"}
            bg={"#E8E8E8"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            borderRadius={5}
            overflow={"hidden"}
            p={2}
          >
            {loading ? (
              <Spinner
                w={20}
                h={20}
                size={"xl"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="message-container">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              {isTyping && (
                <Lottie
                  options={defaultOptions}
                  width={70}
                  height={30}
                  style={{
                    marginLeft: "30px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <Input
                placeholder="Enter a message..."
                onChange={typingHandler}
                bg={"E0E0E0"}
                variant={"filled"}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
          width={"100%"}
        >
          <Text fontSize={"3xl"}>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
