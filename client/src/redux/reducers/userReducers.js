const initialState = {
  user: null,
  onlineUsers: null,
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_USER":
      const { user } = action.payload;
      return {
        ...state,
        user,
      };
    case "CLEAR_USER_ON_LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "UPDATE_ONLINE_USERS":
      const { users } = action.payload;
      return {
        ...state,
        onlineUsers: users,
      };

    default:
      return state;
  }
};

export default userReducers;
