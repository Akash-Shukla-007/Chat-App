import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatContext";
import { isSenderPic } from "../../helper/chatSender";
import { Avatar } from "@chakra-ui/react";

function ScrollableChat({ messages }: { messages?: any }) {
  const { user }: any = ChatState();
  return (
    <ScrollableFeed>
      {messages?.map((message: any, index: any) => {
        return (
          <div
            key={index}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",

              marginBottom: `${
                isSenderPic(messages, message, index, user) ? "13px" : "6px"
              }`,
            }}
          >
            <div
              style={{
                // backgroundColor: "red",
                alignSelf: `${
                  message.sender._id === user.id ? "end" : "flex-start"
                }`,
                display: "flex",
                alignItems: "center",
              }}
            >
              {isSenderPic(messages, message, index, user) ? (
                <Avatar
                  src={message.sender.pic}
                  size={"sm"}
                  marginRight={"10px"}
                />
              ) : (
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "transparent",
                    marginRight: "10px",
                  }}
                ></div>
              )}

              <span
                style={{
                  display: "flex",
                  backgroundColor: `${
                    message.sender._id === user.id ? "blue" : "green"
                  }`,
                  justifySelf: `${
                    message.sender._id === user.id ? "end" : "flex-start"
                  }`,
                  padding: "5px 10px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                {message.content}
              </span>
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
