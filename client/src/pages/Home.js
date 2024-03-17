import React from "react";
import ScrollPosts from "../components/scrollPosts/ScrollPosts";
import Suggestions from "../components/suggestion/Suggestions";

const Home = ({ logInUser }) => {
  return (
    <div className="w-full flex justify-center gap-14 h-screen overflow-y-auto">
      <ScrollPosts logInUser={logInUser} />
      <div className="hidden md:block">
        <Suggestions logInUser={logInUser} />
      </div>
    </div>
  );
};

export default Home;
