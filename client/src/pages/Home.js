import React from "react";
import ScrollPosts from "../components/scrollPosts/ScrollPosts";
import Suggestions from "../components/suggestion/Suggestions";
import Header from "../components/header/Header";
import { useSelector } from "react-redux";

const Home = ({ logInUser }) => {
  const isMessengerOpen = useSelector(
    (state) => state.chatReducers.isMessengerOpen
  );
  return (
    <div className="relative w-full flex justify-center gap-14 h-screen">
      <div
        className={`${
          isMessengerOpen && "hidden"
        } sm:hidden fixed top-0 z-30 w-full`}
      >
        <Header logInUser={logInUser} />
      </div>
      <div className="my-10 sm:mt-0 bg-blue-300">
        <ScrollPosts logInUser={logInUser} />
      </div>
      <div className="hidden md:block">
        <Suggestions logInUser={logInUser} />
      </div>
    </div>
  );
};

export default Home;
