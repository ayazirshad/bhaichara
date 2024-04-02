import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const UserChats = ({ chat, notifications, setNotifications, newMessage }) => {
  const user = useSelector((state) => state.userReducers.user);
  const onlineUsers = useSelector((state) => state.userReducers.onlineUsers);
  const currentChat = useSelector((state) => state.chatReducers.currentChat);
  const [unreadNotifications, setUnreadNotifications] = useState();
  const [thisUserNotifications, setThisUserNotifications] = useState();
  const [latestMessage, setLatestMessage] = useState(null);
  const [sender, setSender] = useState(null);
  const senderId = chat?.members.find((id) => id !== user?._id);
  const unreadNotificationsFunc = (notifs) => {
    return notifs.filter((n) => n.isRead === false);
  };

  useEffect(() => {
    const unreadNotifs = unreadNotificationsFunc(notifications);
    setUnreadNotifications(unreadNotifs);
  }, [notifications]);

  useEffect(() => {
    const thisUserNotifs = unreadNotifications?.filter(
      (n) => n.senderId === senderId
    );
    setThisUserNotifications(thisUserNotifs);
  }, [unreadNotifications]);

  const markThisUserNotificationAsRead = (
    thisUserNotifications,
    notifications
  ) => {
    const mNotifications = notifications.map((el) => {
      let notification;
      thisUserNotifications.forEach((n) => {
        if (n.senderId === el.senderId) {
          notification = { ...n, isRead: true };
        } else {
          notification = el;
        }
      });
      return notification;
    });
    setNotifications(mNotifications);
  };

  useEffect(() => {
    if (senderId) {
      const fetchSender = async () => {
        const res = await fetch(`/user/${senderId}/userId`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setSender(data);
      };
      fetchSender();
    }
  }, []);

  useEffect(() => {
    const fetchmessages = async () => {
      const res = await fetch(`/messages/get/${chat?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setLatestMessage(data[data?.length - 1]);
    };
    fetchmessages();
  }, [newMessage, notifications]);

  const trimText = (msg) => {
    let newTextMsg = msg.substring(0, 15);
    if (msg.length > 15) {
      newTextMsg = newTextMsg + "...";
    }
    return newTextMsg;
  };

  const formateTimeAndDate = (date) => {
    let formattedTime;
    const days = new Date(date).getDay();
    const currentDays = new Date().getDay();
    if (days - currentDays === 0) {
      formattedTime = moment(date).format("hh:mm A");
    } else if (days - currentDays > 0 && days - currentDays === 7) {
      formattedTime = moment(date).format("dddd");
    } else {
      formattedTime = moment(date).format("DD/MM/YY");
    }
    return formattedTime;
  };

  return (
    <div
      className={`flex justify-between items-center w-full sm:w-64 sm:hover:bg-gray-100 transition-all duration-100 py-1 px-4 ${
        currentChat?._id === chat?._id && "bg-gray-200"
      }`}
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length > 0) {
          markThisUserNotificationAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="flex gap-2 items-center">
        <div className="relative">
          <div className="w-11 h-11 object-contain rounded-full overflow-hidden border ">
            <img src={sender?.profilePicture} alt="img" />
          </div>
          <span
            className={`${
              onlineUsers?.some((user) => user?.userId === sender?._id)
                ? "block"
                : "hidden"
            } bg-green-500 p-[6px] rounded-full absolute bottom-[1px] right-[2px]`}
          ></span>
        </div>
        <div>
          <p className="font-semibold text-sm">{sender?.username}</p>
          <p className="text-xs">
            {latestMessage && trimText(latestMessage?.text)}
          </p>
        </div>
      </div>
      <div>
        <div className="text-xs">
          {latestMessage && formateTimeAndDate(latestMessage?.createdAt)}
        </div>
        {thisUserNotifications?.length > 0 && (
          <div className="text-right ">
            <span className="bg-[#0f969c] px-2 py-[3px] text-xs rounded-full text-[#fff]">
              {thisUserNotifications?.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChats;
