export const getSender = (loggedUser: any, users: any) => {
  if (loggedUser.id == users[0]._id) {
    return users[1].name;
  }
  return users[0].name;
};

export const getSenderPic = (loggedUser: any, users: any) => {
  if (loggedUser.id == users[0]._id) {
    return users[1].pic;
  }

  return users[0].pic;
};

export const getFullSenderUser = (loggedUser: any, users: any) => {
  if (loggedUser.id == users[0]._id) {
    return users[1];
  }
  return users[0];
};

export const isSenderPic = (
  messages: any,
  message: any,
  index: number,
  user: any
) => {
  if (index < messages.length - 1) {
    if (
      message.sender._id !== user.id &&
      messages[index + 1].sender._id == user.id
    )
      return true;
  }
  if (index == messages.length - 1) {
    if (message.sender._id !== user.id) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};

export default getSender;
