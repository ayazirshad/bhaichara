import React, { useState } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiMessengerLine, RiMessengerFill } from "react-icons/ri";
import { TiSocialInstagram } from "react-icons/ti";
// import { FiPlusCircle } from "react-icons/fi";
import { HiOutlinePlusCircle, HiMiniPlusCircle } from "react-icons/hi2";
import { RiMenu3Fill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SideMenu = ({ logInUser, setIsAuthenticated }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // console.log(first)
  const loggedInUSer = logInUser;

  const logout = async () => {
    const res = await fetch("/user/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("logout data", data);
    if (data.success === true) {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };
  // console.log("loggedInUSer.profilePicture", loggedInUSer?.profilePicture);
  // const userName = "ali";
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(`/user/${userName}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "aplication/json",
  //       },
  //     });
  //     const data = await response.json();
  //     // console.log(data)
  //     setLoggedInUSer(data);
  //   };
  //   fetchData();
  // }, []);
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
      name: "Notifications",
      path: "/notifications",
      //TODO there is no notification page, needs to reviewed
      icon:
        location.pathname === "/notifications" ? (
          <FaHeart size={21} />
        ) : (
          <FaRegHeart size={21} />
        ),
    },
    {
      name: "Messages",
      path: "/messenger",
      icon:
        location.pathname === "/messenger" ? (
          <RiMessengerFill size={25} />
        ) : (
          <RiMessengerLine size={25} />
        ),
    },
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
  ];
  return (
    <div className="p-[10px] w-max lg:w-60 border-r border-r-gray-300 h-screen">
      <div className="px-2 py-6">
        <div className="lg:hidden">
          <TiSocialInstagram size={25} color="purple" className="mb-1" />
        </div>
        <h1 className="font-bold text-lg hidden lg:block">BhaiChara</h1>
      </div>
      <nav className="flex flex-col gap-3">
        {navItems.map((item, index) => {
          return (
            <Link
              className={`p-[10px] flex gap-3 items-center w-full hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md hover:font-semibold `}
              key={index}
              to={item.path}
            >
              <div
                className={` ${item.name === "Search" ? "font-semibold" : ""}`}
              >
                {item.icon}
              </div>
              <h1
                className={`text-[16px] hidden lg:block ${
                  location.pathname === item.path ? "font-semibold" : ""
                }`}
              >
                {item.name}
              </h1>
            </Link>
          );
        })}
        {/* <div className="p-2 flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md">
          <GoHome size={25} />
          <h1 className="text-[16px]">Home</h1>
        </div>
        <div className="p-2 flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md">
          <IoSearch size={25} />
          <h1 className="text-[16px]">Search</h1>
        </div>
        <div className="p-2 flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md">
          <FaRegHeart size={22} />
          <h1 className="text-[16px]">Notifications</h1>
        </div>
        <div className="p-2 flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md">
          <RiMessengerLine size={25} />
          <h1 className="text-[16px]">Messages</h1>
        </div>
        <div className="p-2 flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md">
          <FiPlusCircle size={24} />
          <h1 className="text-[16px]">Create</h1>
        </div> */}
        <Link
          className="p-[10px] flex gap-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md"
          to={"/profile"}
        >
          <div className="overflow-hidden rounded-full">
            <img
              src={loggedInUSer?.profilePicture}
              alt="img"
              className="w-6 h-6"
            />
          </div>
          <h1
            className={`text-[16px] hover:font-semibold hidden lg:block ${
              location.pathname === "/profile" ? "font-semibold" : ""
            }`}
          >
            Profile
          </h1>
        </Link>
      </nav>
      <div
        className="p-[10px] flex relative gap-3 mt-3 items-center hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md"
        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
      >
        <RiMenu3Fill size={25} />
        <h1
          className={`text-[16px] hidden lg:block ${
            isMoreMenuOpen ? "font-semibold" : ""
          }`}
        >
          More
        </h1>
        <div
          className={`absolute w-64 z-20 -top-[380%] shadow-xl p-[10px] bg-[#fefefe] rounded-xl ${
            isMoreMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="p-[10px] w-full hover:bg-gray-100 transition-all duration-300 py-2 rounded-md">
            <h1>Settings</h1>
          </div>
          <div className="p-[10px] w-full hover:bg-gray-100 transition-all duration-300 py-2 rounded-md">
            <button> Switch appearance</button>
          </div>
          <div className="  border-t mt-2 ">
            <button
              className="mt-2 text-red-500 hover:bg-red-100 transition-all duration-300 p-[10px] w-full py-2 rounded-md"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
