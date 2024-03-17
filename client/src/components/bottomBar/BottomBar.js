import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiMiniPlusCircle, HiOutlinePlusCircle } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { RiMessengerFill, RiMessengerLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

const BottomBar = ({ logInUser, setIsAuthenticated }) => {
  const location = useLocation();
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon:
        location.pathname === "/" ? (
          <GoHomeFill size={25} />
        ) : (
          <GoHome size={25} />
        ),
    },
    { name: "Search", path: "/search", icon: <IoSearch size={25} /> },
    {
      name: "Create",
      path: "/create",
      icon:
        location.pathname === "/create" ? (
          <HiMiniPlusCircle size={28} />
        ) : (
          <HiOutlinePlusCircle size={28} />
        ),
    },
    {
      name: "Notifications",
      path: "/notifications",
      //TODO there is no notification page, needs to reviewed
      icon:
        location.pathname === "/notifications" ? (
          <FaHeart size={23} />
        ) : (
          <FaRegHeart size={23} />
        ),
    },
  ];
  return (
    <div className="bg-[#fff] w-full flex justify-between py-5 px-3 bottom-0">
      {navItems.map((item, index) => {
        return (
          <Link
            className={` items-center flex justify-center  hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md hover:font-semibold ${
              item.name === "Search" ? "font-semibold" : ""
            }`}
            key={index}
            to={item.path}
          >
            {item.icon}
          </Link>
        );
      })}
      <Link
        className=" flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer overflow-hidden rounded-full w-7 h-7"
        to={"/profile"}
      >
        <img
          src={logInUser?.profilePicture}
          alt="img"
          className="w-full h-full"
        />
      </Link>
    </div>
  );
};

export default BottomBar;
