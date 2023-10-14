import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChats } from "../services/httpServices";

const ChatContext: any = createContext(null);

const ChatProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState<any>({});
  const [chats, setChats] = useState<any>([]);
  const [notifications, setNotifications] = useState<any>([]);

  const User: any = JSON.parse(localStorage.getItem("User")!);
  useEffect(() => {
    setUser(User);
    if (!User) {
      return navigate("/");
    }
    fetchChat();
  }, [navigate]);

  const fetchChat = async () => {
    const { data } = await fetchChats();
    console.log("res ->", data.result);
    setChats(data.result);
  };
  useEffect(() => {
    if (User) {
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
