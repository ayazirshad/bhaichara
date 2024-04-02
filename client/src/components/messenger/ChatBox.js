import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageSender } from "../../redux/actions";
import { Link } from "react-router-dom";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Message from "./Message";
import InputEmoji from "react-input-emoji";
import { IoArrowBack, IoPaperPlane } from "react-icons/io5";

const ChatBox = ({
  setNotifications,
  newMessage,
  setNewMessage,
  setIsChatOpen,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [ischatDeleteOpen, setIschatDeleteOpen] = useState(false);
  const scroll = useRef();
  const chat = useSelector((state) => state.chatReducers.currentChat);
  const socket = useSelector((state) => state.chatReducers.socket);
  const user = useSelector((state) => state.userReducers.user);
  const onlineUsers = useSelector((state) => state.userReducers.onlineUsers);
  const sender = useSelector((state) => state.chatReducers.messageSender);

  const senderId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    if (senderId) {
      const fetchSender = async () => {
        setLoading(true);
        const res = await fetch(`/user/${senderId}/userId`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        const data = await res.json();
        dispatch(messageSender(data));
      };
      fetchSender();
    }
  }, [chat]);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch(`/messages/get/${chat?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setMessages(data);
    };
    setIschatDeleteOpen(false);
    loadMessages();
  }, [chat]);

  const sendTextMessage = async (senderId, chatId, text) => {
    const res = await fetch("/messages/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId, chatId, text }),
    });
    const data = await res.json();
    setNewMessage(data);
    setMessages((prev) => [...prev, data]);
    setTextMessage("");
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, senderId]);

  useEffect(() => {
    if (socket === null) return;
    const recipientId = chat?.members.find((id) => id !== user?._id);
    const msg = { ...newMessage, recipientId };
    socket.emit("sendMessage", msg);
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (msg) => {
      if (chat?._id !== msg.chatId) return;
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("getNotification", (notif) => {
      const isChatOpen = chat?.members.some((id) => id === notif.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...notif, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [notif, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [chat, socket]);

  return (
    <>
      {loading ? (
        <div className="h-full w-full flex justify-center items-center">
          loading...
        </div>
      ) : chat ? (
        <div className="h-full flex flex-col">
          <div className=" relative justify-between items-center border-b  z-10 border-b-gray-300 flex w-full bg-[#fff] p-3">
            <div className="flex gap-3 items-center">
              <div className="flex gap-3 items-center">
                <button
                  className="sm:hidden"
                  onClick={() => setIsChatOpen(false)}
                >
                  <IoArrowBack size={23} />
                </button>
                <div className="w-10 h-10 object-contain rounded-full overflow-hidden border">
                  <img src={sender?.profilePicture} alt="img" />
                </div>
                <div className="transition-all duration-200">
                  <Link
                    to={`/account/${sender?.username}`}
                    className="font-semibold"
                  >
                    {sender?.username}
                  </Link>
                  <span
                    className={`${
                      onlineUsers?.some((user) => user?.userId === sender?._id)
                        ? "block"
                        : "hidden"
                    }  gap-1 flex items-center text-xs`}
                  >
                    online
                  </span>
                </div>
              </div>
            </div>
            <div
              className="sm:hover:bg-gray-200 transition-all duration-200 rounded-full p-2"
              role="button"
              onClick={() => setIschatDeleteOpen(!ischatDeleteOpen)}
            >
              <BiDotsHorizontalRounded size={25} />
            </div>
            <div
              className={`absolute right-10 top-14 ${
                ischatDeleteOpen ? "block" : "hidden"
              } py-2 rounded-md border border-gray-300 bg-[#fff] shadow-lg`}
            >
              <button className="px-6 py-1 sm:hover:bg-gray-200 transition-all duration-200">
                delete chat
              </button>
            </div>
          </div>
          <div className="h-full flex-1 overflow-y-auto py-5 px-3">
            <div className="w-full  flex flex-col justify-center items-center mb-5">
              <div className="w-20 h-20 object-contain rounded-full overflow-hidden border">
                <img src={sender?.profilePicture} alt="img" />
              </div>
              <div className="text-sm font-semibold">{sender?.name}</div>
              <div className="text-xs">{sender?.username} · BhaiChara</div>
              <Link
                to={`/account/${sender?.username}`}
                className="px-3 py-1 rounded-md bg-gray-200 mt-2 sm:hover:bg-gray-100 transition-all duration-200"
              >
                View profile
              </Link>
            </div>
            <div>
              {messages.length > 0 &&
                messages.map((message, index) => {
                  return (
                    <div key={index} ref={scroll}>
                      <Message message={message} />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="bg-[#fff] w-full p-2 border-t border-t-gray-300 flex items-center">
            <InputEmoji
              value={textMessage}
              onChange={setTextMessage}
              borderColor="rgba(72,112,223,0.2)"
            />
            <button
              className="text-gray-600 "
              onClick={() => sendTextMessage(user?._id, chat?._id, textMessage)}
            >
              <IoPaperPlane size={26} />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-full  w-full flex justify-center items-center">
          send messages to your friends
        </div>
      )}
    </>
  );
};

export default ChatBox;
