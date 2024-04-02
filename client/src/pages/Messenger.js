import React, { useEffect, useState } from "react";
import UserChats from "../components/messenger/UserChats";
import ChatBox from "../components/messenger/ChatBox";
import { useDispatch, useSelector } from "react-redux";
import {
  isMessengerOpen,
  loadChats,
  updateCurrentChat,
} from "../redux/actions";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Messenger = () => {
  const user = useSelector((state) => state.userReducers.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const res = await fetch(`/chats/get/${user?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      const data = await res.json();
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      dispatch(loadChats(sortedData));
      setChats(sortedData);
    };
    fetchChats();
  }, [user?._id]);

  return (
    <div className="flex h-screen">
      <div
        className={`h-full w-full relative sm:w-min overflow-y-auto py-8 border-r border-r-gray-300 ${
          isChatOpen && "hidden sm:block"
        }`}
      >
        <div className="fixed top-0 border-b z-10 bg-[#fff] w-full sm:w-64 border-b-gray-300 flex gap-3 mb-2 py-4 px-3">
          <button
            className="sm:hidden"
            onClick={() => {
              dispatch(isMessengerOpen(false));
              navigate("/");
            }}
          >
            <IoArrowBack size={23} />
          </button>
          <h3 className="font-semibold">{user?.username}</h3>
        </div>
        {loading ? (
          <p className="w-full sm:w-64 h-full flex justify-center items-center">
            loading...
          </p>
        ) : chats?.length > 0 ? (
          <div className="py-12">
            {chats.map((chat, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    dispatch(updateCurrentChat(chat));
                    setIsChatOpen(true);
                  }}
                >
                  <UserChats
                    chat={chat}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    newMessage={newMessage}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="w-full sm:w-64 h-full flex justify-center items-center">
            no chats
          </p>
        )}
      </div>
      <div
        className={`flex-1 h-full w-full ${
          isChatOpen ? "" : "hidden sm:block"
        }`}
      >
        <ChatBox
          setNotifications={setNotifications}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          setIsChatOpen={setIsChatOpen}
        />
      </div>
    </div>
  );
};

export default Messenger;
