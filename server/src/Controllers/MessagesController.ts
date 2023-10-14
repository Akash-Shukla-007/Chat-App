import Chat from "../Models/ChatModel";
import Message from "../Models/Message";
import User from "../Models/User";

const sendMessage = async (req: any, res: any) => {
  const { content, chatId } = req.body;
  if (content == "" || chatId == "")
    return res.staus(400).json({ message: "Invalid data Passed" });

  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    return res.status(201).json(message);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const allMessages = async (req: any, res: any) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email pic")
      .populate("chat");
    return res.status(200).json(message);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export { sendMessage, allMessages };
