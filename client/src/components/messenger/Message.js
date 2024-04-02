import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const Message = ({ message }) => {
  const user = useSelector((state) => state.userReducers.user);

  return (
    <div
      className={` my-1 flex  ${
        message?.senderId === user?._id ? "justify-end " : "justify-start  "
      }`}
    >
      <div
        className={` w-max rounded-lg py-1 px-3 ${
          message.senderId === user._id
            ? " bg-[#3797F0] text-[#fff]"
            : " bg-[#EFEFEF] "
        }`}
      >
        <p className="max-w-96">{message.text}</p>
        <p
          className={` text-xs text-right ${
            message.senderId === user._id ? " text-gray-200" : " text-gray-400 "
          }`}
        >
          {moment(message.createdAt).calendar()}
        </p>
      </div>
    </div>
  );
};

export default Message;
