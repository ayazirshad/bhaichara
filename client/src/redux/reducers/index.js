import chatReducers from "./chatReducers";
import userReducers from "./userReducers";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
  chatReducers,
  userReducers,
});

export default rootReducer;
