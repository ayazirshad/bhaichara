import React from "react";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full font-insta bg-[#fff] px-3 py-[6px] flex justify-between items-center">
      <h1 className="text-3xl">BhaiChara</h1>
      <Link to={"/messenger"}>
        {/* TODO there is no notification page, needs to reviewed */}
        <RiMessengerLine size={25} />
      </Link>
    </div>
  );
};

export default Header;
