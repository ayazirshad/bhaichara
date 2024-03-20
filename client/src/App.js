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

const App = () => {
  const navigate = useNavigate();
  const [logInUser, setLogInUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("app use effect running");
    const loadUser = async () => {
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
        setIsAuthenticated(data.authenticated);
        navigate("/");
      } else {
        navigate("/login");
      }
    };
    loadUser();
  }, [isAuthenticated]);

  return (
    <div className="sm:flex w-full">
      {isAuthenticated ? (
        <>
          <div className="hidden sm:block">
            <SideMenu
              logInUser={logInUser}
              setIsAuthenticated={setIsAuthenticated}
            />
          </div>

          <Routes>
            <Route path="/" element={<Home logInUser={logInUser} />} />
            <Route path="/search" element={<Search logInUser={logInUser} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messenger" element={<Messenger />} />
            <Route path="/create" element={<Create logInUser={logInUser} />} />
            <Route
              path="/profile"
              element={<Profile logInUser={logInUser} />}
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
          <div className="sm:hidden fixed bottom-0 z-20 w-full">
            <BottomBar
              logInUser={logInUser}
              setIsAuthenticated={setIsAuthenticated}
            />
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
