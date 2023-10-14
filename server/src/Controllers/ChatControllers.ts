import Chat from "../Models/ChatModel";
import User from "../Models/User";

const accessChat = async (req: any, res: any) => {
  const { userId } = req.body;

  var isChat: any = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res.json(isChat[0]);
  } else {
    var createdchat = await Chat.create({
      chatName: "Chat Created",
      isGroupChat: false,
      users: [req.user._id, userId],
    });
    var fullChat = await Chat.find({ _id: createdchat._id }).populate(
      "users",
      "-password"
    );
    return res.json(fullChat);
  }
};

const fetchChat = async (req: any, res: any) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result: any) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.json({ result });
      });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
const createGroupChat = async (req: any, res: any) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all the details" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More than two 2 users are required to form Group" });
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json(fullGroupChat);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
const renameGroup = async (req: any, res: any) => {
  const { groupId, groupName } = req.body;

  try {
    const updatedName = await Chat.findByIdAndUpdate(
      groupId,
      { chatName: groupName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (updatedName) {
      return res.status(201).json(updatedName);
    } else {
      return res.status(404).json({ message: "Chat not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
const addToGroup = async (req: any, res: any) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Chat.findByIdAndUpdate(
      groupId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (group) {
      return res.status(201).json(group);
    } else {
      return res.status(404).json({ message: "Group not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
const removeFromGroup = async (req: any, res: any) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Chat.findByIdAndUpdate(
      groupId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (group) {
      return res.status(201).json(group);
    } else {
      return res.status(404).json({ message: "Group not Found" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
