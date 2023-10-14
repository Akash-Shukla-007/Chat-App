import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { createGroup, searchUser } from "../../../services/httpServices";
import SearchUserBox from "../SearchUserBox";
import { useToast } from "@chakra-ui/react";
import UserBadge from "../UserBadge";
import { ChatState } from "../../../context/ChatContext";

function GroupChatModal({ children }: { user?: any; children?: any }) {
  const { chats, setChats }: any = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectUsers, setSelectUsers] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [searchedResult, setSearchedResult] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: any) => {
    setSearch(query);
    if (query == "") return;
    setLoading(true);
    try {
      const { data } = await searchUser(query);
      console.log(data);
      setSearchedResult(data.users);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleGroup = (user: any) => {
    if (selectUsers.includes(user)) {
      return toast({ title: "User already Added", status: "warning" });
    }
    setSelectUsers((pre: any) => {
      return [...pre, user];
    });
    return toast({ title: "User Added", status: "success" });
  };

  const handleUserBadge = (id: any) => {
    setSelectUsers(selectUsers.filter((sel: any) => sel._id !== id));
  };

  const handleSubmit = async () => {
    if (groupName == "")
      return toast({ title: "Group Name is Required", status: "warning" });

    if (selectUsers.length < 2)
      return toast({
        title: "Min 2 Users are required to create Group",
        status: "warning",
      });

    try {
      const { data } = await createGroup({
        name: groupName,
        users: JSON.stringify(selectUsers),
      });
      console.log(data);
      setChats([data, ...chats]);
      onClose();
      return toast({ title: "Group Created", status: "success" });
    } catch (error: any) {
      console.log(error);
      return toast({ title: "Failed to Create the Group", status: "error" });
    }
  };

  useEffect(() => {
    handleSearch;
  }, [search]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent="center">
            Create Group
          </ModalHeader>
          <ModalBody
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Enter Group Name"
                onChange={(e) => setGroupName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box
              maxHeight={"70px"}
              w={"100%"}
              display={"flex"}
              gap={2}
              flexWrap={"wrap"}
              overflowY={"scroll"}
              my={2}
            >
              {selectUsers.map((item: any, index: any) => {
                return (
                  <UserBadge
                    key={index}
                    user={item}
                    handleFucntion={() => {
                      handleUserBadge(item._id);
                    }}
                  />
                );
              })}
            </Box>
            <Box maxHeight={"250px"} overflowY={"scroll"} width={"100%"}>
              {!searchedResult ? (
                <Text>Loading</Text>
              ) : (
                searchedResult.map((item: any, index: any) => {
                  return (
                    <SearchUserBox
                      key={index}
                      user={item}
                      handleFucntion={() => handleGroup(item)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
