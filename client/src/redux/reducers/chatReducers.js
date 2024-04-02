const initialState = {
  currentChat: null,
  messageSender: null,
  userChats: [],
  socket: null,
  notifications: [],
  isMessengerOpen: false,
};
const chatReducers = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CURRENT_CHAT":
      const { chat } = action.payload;
      return {
        ...state,
        currentChat: chat,
      };
    case "MESSAGE_SENDER":
      const { user } = action.payload;
      return {
        ...state,
        messageSender: user,
      };
    case "LOAD_CHATS":
      const { chats } = action.payload;
      return {
        ...state,
        userChats: chats,
      };
    case "CREATE_USER_CHAT":
      const { createdChat } = action.payload;
      return {
        ...state,
        userChats: [...state.userChats, createdChat],
      };
    case "LOAD_SOCKET":
      const { socket } = action.payload;
      return {
        ...state,
        socket,
      };
    case "DISCONNECT_SOCKET":
      state.socket?.disconnect();
      return {
        ...state,
        socket: null,
      };
    case "UPDATE_NOTIFICATIONS":
      const { notifications } = action.payload;
      return {
        ...state,
        notifications,
      };
    case "IS_MESSENGER_OPEN":
      const { value } = action.payload;
      return {
        ...state,
        isMessengerOpen: value,
      };
    default:
      return state;
  }
};

export default chatReducers;
