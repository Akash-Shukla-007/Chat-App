import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});
API.interceptors.request.use(
  (req: any) => {
    let User = localStorage.getItem("User");
    if (User !== null) {
      let Token = JSON.parse(User).Token;
      req.headers.authorization = `Bearer ${Token}`;
      console.log(Token);
    }
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// User ApI
export const signUp = (data: any) => API.post("/user/signup", data);
export const logIn = (data: any) => API.post("/user/login", data);

export const searchUser = (search: string) =>
  API.get(`/user/?search=${search}`);

// Chat API
export const accesChat = (data: any) => API.post("/chat/", data);
export const fetchChats = () => API.get("/chat/");
export const createGroup = (data: any) => API.post("/chat/group", data);
export const addToGroup = (data: any) => API.put("/chat/addtogroup", data);
export const RemoveFromGroup = (data: any) =>
  API.put("/chat/removefromgroup", data);
export const groupRename = (data: any) => API.put("/chat/rename", data);

// Message API
export const sendMessages = (data: any) => API.post("/message/", data);
export const fetchAllMessages = (data: any) =>
  API.get(`/message/${data.chatId}`);
