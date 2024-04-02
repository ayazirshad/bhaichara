export const loadUser = (user) => {
  return {
    type: "LOAD_USER",
    payload: {
      user,
    },
  };
};

export const loadChats = (chats) => {
  return {
    type: "LOAD_CHATS",
    payload: {
      chats,
    },
  };
};

export const updateCurrentChat = (chat) => {
  return {
    type: "UPDATE_CURRENT_CHAT",
    payload: {
      chat,
    },
  };
};

export const messageSender = (user) => {
  return {
    type: "MESSAGE_SENDER",
    payload: {
      user,
    },
  };
};

export const createUserChat = (createdChat) => {
  return {
    type: "CREATE_USER_CHAT",
    payload: {
      createdChat,
    },
  };
};

export const clearUserOnLogout = () => {
  return {
    type: "CLEAR_USER_ON_LOGOUT",
  };
};

export const loadSocket = (socket) => {
  return {
    type: "LOAD_SOCKET",
    payload: {
      socket,
    },
  };
};

export const disconnectSocket = () => {
  return {
    type: "DISCONNECT_SOCKET",
  };
};

export const updateOnlineUsers = (users) => {
  return {
    type: "UPDATE_ONLINE_USERS",
    payload: {
      users,
    },
  };
};

export const updateNotifications = (notifications) => {
  return {
    type: "UPDATE_NOTIFICATIONS",
    payload: {
      notifications,
    },
  };
};

export const isMessengerOpen = (value) => {
  return {
    type: "IS_MESSENGER_OPEN",
    payload: {
      value,
    },
  };
};
