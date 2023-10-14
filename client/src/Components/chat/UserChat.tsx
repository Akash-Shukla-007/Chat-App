import { ChatState } from "../../context/ChatContext";
import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/react";
import add from "../../assets/add.svg";
import getSender, { getSenderPic } from "../../helper/chatSender";
import GroupChatModal from "./Modal/GroupChatModal";

function UserChat() {
  const { user, selectedChat, setSelectedChat, chats }: any = ChatState();

  return (
    <>
      <Box
        display={{
          base: Object.keys(selectedChat).length !== 0 ? "none" : "flex",
          md: "flex",
        }}
        flexDir={"column"}
        alignItems={"center"}
        p={2}
        borderRadius={5}
        w={{ base: "100%", md: "31%" }}
        minWidth={"280px"}
        borderWidth={"1px"}
        bg="#EDF2F7"
        height={{ base: "88.5vh", md: "86vh", lg: "86vh" }}
        bgColor={"#F8F8F8"}
      >
        <Box
          w="100%"
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize={{ base: "20px", md: "23px" }}>My Chats</Text>
          <GroupChatModal>
            <Button gap={2}>
              <Text fontSize={{ base: "15px" }}>New Group</Text>
              <img src={add} alt="add icon" />
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          w={"100%"}
          overflowY={"hidden"}
          height={"100%"}
        >
          {chats ? (
            <Stack overflowY={"scroll"} height={"100%"} mt={5}>
              {chats.map((item: any, index: any) => {
                return (
                  <Box
                    display="flex"
                    w="100%"
                    alignItems={"center"}
                    gap={4}
                    key={index}
                    p={2}
                    borderRadius={5}
                    cursor={"pointer"}
                    bg={selectedChat._id === item._id ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat._id === item._id ? "white" : "black"}
                    onClick={() => setSelectedChat(item)}
                  >
                    <Avatar
                      boxSize={"40px"}
                      borderRadius="full"
                      src={`${getSenderPic(user, item.users)}`}
                    />
                    <Box>
                      <Text fontWeight={"medium"}>
                        {item.isGroupChat
                          ? item.chatName
                          : getSender(user, item.users)}
                      </Text>
                      {item?.latestMessage && (
                        <Text fontSize={"xs"}>
                          <span style={{ fontWeight: 500 }}>
                            {item?.latestMessage?.sender.name}
                          </span>
                          : {item?.latestMessage?.content.slice(0, 18)}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <Text>Loading</Text>
          )}
        </Box>
      </Box>
    </>
  );
}

export default UserChat;
