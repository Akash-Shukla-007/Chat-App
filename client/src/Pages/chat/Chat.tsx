import { Box } from "@chakra-ui/react";
import SideDrawer from "../../Components/chat/SideDrawer";
import { ChatState } from "../../context/ChatContext";
import UserChat from "../../Components/chat/UserChat";
import DescriptiveChat from "../../Components/chat/DescriptiveChat";

function Chat() {
  const { user }: any = ChatState();

  return (
    <div style={{ width: "100%", height: "100vh" }} className="root-chat">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        padding="10px"
        width="100%"
        gap={3}
      >
        {user && <UserChat />}
        {user && <DescriptiveChat />}
      </Box>
    </div>
  );
}

export default Chat;
