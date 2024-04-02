import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import SideMenu from "./components/sideMenu/SideMenu";
import Account from "./pages/Account";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messenger from "./pages/Messenger";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import PersonalPost from "./pages/PersonalPost";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BottomBar from "./components/bottomBar/BottomBar";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  disconnectSocket,
  loadSocket,
  loadUser,
  updateOnlineUsers,
} from "./redux/actions";
import { io } from "socket.io-client";

const App = () => {
  const socket = useSelector((state) => state.chatReducers.socket);
  const isMessengerOpen = useSelector(
    (state) => state.chatReducers.isMessengerOpen
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logInUser, setLogInUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state) => state.userReducers.user);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const res = await fetch("/user/loadUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 200) {
        setLogInUser(data.user);
        dispatch(loadUser(data.user));
        setIsAuthenticated(data.authenticated);
        navigate("/");
      } else {
        dispatch(disconnectSocket());
        navigate("/login");
      }
    };
    loadCurrentUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io("http://localhost:8000");
      dispatch(loadSocket(newSocket));
      // setSocket(newSocket);
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      dispatch(updateOnlineUsers(res));
      // setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user, dispatch]);

  return (
    <div className=" sm:flex w-full">
      {isAuthenticated ? (
        <>
          <div className=" hidden sm:block">
            <SideMenu
              logInUser={logInUser}
              setIsAuthenticated={setIsAuthenticated}
            />
          </div>

          <div className="flex-1 ">
            <Routes>
              <Route path="/" element={<Home logInUser={logInUser} />} />
              <Route
                path="/search"
                element={<Search logInUser={logInUser} />}
              />
              <Route
                path="/notifications"
                element={<Notifications logInUser={logInUser} />}
              />
              <Route
                path="/messenger"
                element={<Messenger logInUser={logInUser} />}
              />
              <Route
                path="/create"
                element={<Create logInUser={logInUser} />}
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    logInUser={logInUser}
                    setIsAuthenticated={setIsAuthenticated}
                  />
                }
              />
              <Route
                path="/profile/edit"
                element={<EditProfile logInUser={logInUser} />}
              />
              <Route
                path="/post/:postId"
                element={<PersonalPost logInUser={logInUser} />}
              />
              <Route
                path="/account/:userName"
                element={<Account logInUser={logInUser} />}
              />
            </Routes>
          </div>
          <div
            className={`${
              isMessengerOpen && "hidden"
            } sm:hidden fixed bottom-0 z-20 w-full`}
          >
            <BottomBar logInUser={logInUser} />
          </div>
        </>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
