import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./Pages/chat/Chat";
import ChatProvider from "./context/ChatContext";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <ChatProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="chat" element={<Chat />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
