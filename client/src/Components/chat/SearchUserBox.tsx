import { Avatar, Box, Text } from "@chakra-ui/react";

function SearchUserBox({
  user,
  handleFucntion,
}: {
  user: any;
  handleFucntion?: any;
}) {
  return (
    <>
      <Box
        onClick={handleFucntion}
        display="flex"
        width="100%"
        bg="#EDF2F7"
        _hover={{
          background: "#38B2AC",
          color: "#ffffff",
        }}
        cursor="pointer"
        alignItems="center"
        gap={2}
        my={3}
        p={1}
        borderRadius={5}
      >
        {user?.pic ==
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg" ? (
          <Avatar boxSize="40px" src={user.pic} />
        ) : (
          <Avatar boxSize="40px" />
        )}
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">{user.email}</Text>
        </Box>
      </Box>
    </>
  );
}

export default SearchUserBox;
