import React, { useEffect, useState } from "react";
import ScrollPosts from "../components/scrollPosts/ScrollPosts";
import Suggestions from "../components/suggestion/Suggestions";
import Header from "../components/header/Header";

const Home = ({ logInUser }) => {
  return (
    <div className="relative w-full flex justify-center gap-14 h-screen overflow-y-auto">
      <div className="sm:hidden fixed top-0 z-30 w-full">
        <Header logInUser={logInUser} />
      </div>
      <div className="mt-10 sm:mt-0 ">
        <ScrollPosts logInUser={logInUser} />
      </div>
      <div className="hidden md:block">
        <Suggestions logInUser={logInUser} />
      </div>
    </div>
  );
};

export default Home;
