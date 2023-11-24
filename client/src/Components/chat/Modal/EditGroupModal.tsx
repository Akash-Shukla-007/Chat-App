import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  // Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  // Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../context/ChatContext";
import UserBadge from "../UserBadge";
import {
  RemoveFromGroup,
  addToGroup,
  groupRename,
  searchUser,
} from "../../../services/httpServices";
import SearchUserBox from "../SearchUserBox";

function EditGroupModal() {
  const toast = useToast();
  const { selectedChat, setSelectedChat }: any = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState("");
  // const [selectUsers, setSelectUsers] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [searchedResult, setSearchedResult] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleRemoveFromGroup = async (id: any) => {
    setLoading(true);
    try {
      const { data } = await RemoveFromGroup({
        groupId: selectedChat._id,
        userId: id,
      });
      // console.log(data);
      setLoading(false);
      setSelectedChat((pre: any) => {
        return { ...pre, users: data.users };
      });
      toast({ title: "User Removed from the Group", status: "success" });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({ title: "Error occured", status: "error" });
    }
  };

  const handleSearch = async (query: any) => {
    setSearch(query);
    if (query == "") return;
    setLoading(true);
    try {
      const { data } = await searchUser(query);
      // console.log(data);
      setSearchedResult(data.users);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleAddtoGroup = async (user: any) => {
    if (selectedChat.users.find((i: any) => i._id === user._id)) {
      return toast({
        title: "User already Present in Group",
        status: "warning",
      });
    }
    setLoading(true);
    try {
      const { data } = await addToGroup({
        groupId: selectedChat._id,
        userId: user._id,
      });
      setSelectedChat((pre: any) => {
        return { ...pre, users: data.users };
      });
      toast({ title: "User added to the Group", status: "success" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({ title: "Error occured", status: "error" });
    }
  };
  const updateGroupName = async () => {
    if (groupName == "")
      return toast({ title: "Group name is Required", status: "error" });
    try {
      const { data } = await groupRename({
        groupId: selectedChat._id,
        groupName,
      });
      setSelectedChat(data);
      onClose();
      window.location.reload();
      return toast({ title: "Group name Updated", status: "success" });
      // console.log(data);
    } catch (error) {
      console.log(error);
      return toast({ title: "Error ocuured", status: "error" });
    }
  };

  const handleSubmit = () => {};

  return (
    <>
      <IconButton
        aria-label="edit group"
        icon={<EditIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={3}>
            <Box
              maxHeight={"70px"}
              w={"100%"}
              display={"flex"}
              gap={2}
              flexWrap={"wrap"}
              overflowY={"scroll"}
              my={2}
            >
              {selectedChat.users.map((item: any, index: any) => {
                return (
                  <UserBadge
                    key={index}
                    user={item}
                    handleFucntion={() => {
                      handleRemoveFromGroup(item._id);
                    }}
                  />
                );
              })}
            </Box>
            <FormControl display={"flex"} gap={2}>
              <Input
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              ></Input>
              <Button
                variant={"solid"}
                colorScheme="teal"
                onClick={updateGroupName}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box maxHeight={"250px"} overflowY={"scroll"} width={"100%"}>
              {loading ? (
                <Spinner />
              ) : (
                searchedResult.map((item: any, index: any) => {
                  return (
                    <SearchUserBox
                      key={index}
                      user={item}
                      handleFucntion={() => handleAddtoGroup(item)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditGroupModal;
