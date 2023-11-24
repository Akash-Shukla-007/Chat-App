import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import searchIcon from "../../assets/search.svg";
import Bellicon from "../../assets/Bell-Icon.svg";
import { ChatState } from "../../context/ChatContext";
import ProfileModal from "./Modal/ProfileModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { accesChat, searchUser } from "../../services/httpServices";
import { toast } from "react-toastify";
import UserSkelton from "./UserSkelton";
import SearchUserBox from "./SearchUserBox";

function SideDrawer() {
  const {
    setSelectedChat,
    // selectedChat,
    user,
    chats,
    setChats,
    notifications,
    setNotifications,
  }: any = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState<any>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchText !== "") {
      setLoading(true);
      try {
        const response = await searchUser(searchText);
        // console.log(response.data);
        setSearchedUser(response.data.users);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
        // console.log(error);
      }
    }
  };

  useEffect(() => {
    if (searchText == "") {
      return setSearchedUser([]);
    }
    handleSearch();
  }, [searchText]);

  const logoutHandler = () => {
    localStorage.removeItem("User");
    navigate("/");
  };

  const accessChat = async (id: any) => {
    setChatLoading(true);
    try {
      const { data } = await accesChat({ userId: id });
      // console.log(data);
      if (!chats.find((chat: any) => chat._id === data._id)) {
        // console.log("user not in chat");
        setChats((pre: any) => [...data, ...pre]);
      }
      // console.log(chats);
      // console.log(selectedChat, data);
      // setSelectedChat(data);
      setChatLoading(false);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
      // console.log(error);
      setChatLoading(false);
    }
  };

  return (
    <>
      <Box
        p="5px 10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        borderWidth="5px"
      >
        <Tooltip label="Search Users for Chat" hasArrow>
          <Button variant="ghost" onClick={onOpen}>
            <img src={searchIcon} alt="" />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={{ base: "25", md: "35px", lg: "40px" }}
          fontWeight="normal"
        >
          Chat-Box
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Menu>
            <MenuButton p={1}>
              {notifications?.length !== 0 && (
                <Text
                  style={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    backgroundColor: "red",
                    marginTop: "-8px",
                    marginLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    borderRadius: "50%",
                    aspectRatio: 1,
                    color: "white",
                  }}
                >
                  {notifications?.length}
                </Text>
              )}
              <img src={Bellicon} width={20} />
            </MenuButton>
            <MenuList p={2}>
              {notifications?.length == 0 && "No New Messages"}
              {notifications?.map((item: any, index: any) => {
                return (
                  <MenuItem
                    onClick={() => {
                      setSelectedChat(item.chat);
                      // if (!chats.find((chat: any) => chat._id === item.chat._id)) {
                      //   console.log(chats, "  ---->   ", item.chat);
                      //   setChats((pre: any) => [...item.chat, ...pre]);
                      // }
                      setNotifications((pre: any) => {
                        return pre.filter(
                          (notif: any) => notif._id !== item._id
                        );
                      });
                    }}
                    key={index}
                  >
                    {item.chat.isGroupChat
                      ? `New Message in ${item.chat.chatName}`
                      : `${item.sender.name} sent you a message`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" mt={2}>
              <Input
                placeholder="Search by name or email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Box>
            {loading ? (
              <UserSkelton />
            ) : (
              searchedUser?.map((item: any, index: any) => {
                return (
                  <SearchUserBox
                    key={index}
                    user={item}
                    handleFucntion={() => accessChat(item._id)}
                  />
                );
              })
            )}
            {chatLoading && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
