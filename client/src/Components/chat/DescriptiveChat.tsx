import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatContext";
import SingleChat from "./SingleChat";

function DescriptiveChat() {
  const { selectedChat }: any = ChatState();
  console.log(selectedChat);
  return (
    <>
      <Box
        display={{
          base: Object.keys(selectedChat).length !== 0 ? "flex" : "none",
          md: "flex",
        }}
        flexDir={"column"}
        alignItems={"center"}
        p={2}
        borderRadius={5}
        width={"100%"}
        borderWidth={"1px"}
        bg="#EDF2F7"
        height={{ base: "88.5vh", md: "86vh", lg: "86vh" }}
      >
        <SingleChat />
      </Box>
    </>
  );
}

export default DescriptiveChat;
