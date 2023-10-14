import { Box, Text } from "@chakra-ui/react";
import close from "../../assets/close.svg";

function UserBadge({
  user,
  handleFucntion,
}: {
  user?: any;
  handleFucntion?: any;
}) {
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        backgroundColor={"green"}
        color={"white"}
        p={1}
        borderRadius={3}
      >
        <Text fontSize={"small"}>{user.name}</Text>
        <img
          src={close}
          alt="close button"
          style={{ cursor: "pointer", paddingLeft: "10px" }}
          onClick={handleFucntion}
        />
      </Box>
    </>
  );
}

export default UserBadge;
