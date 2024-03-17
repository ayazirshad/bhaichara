import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Suggestions = ({ logInUser }) => {
  console.log("logInUser suggestion", logInUser);
  const userName = logInUser?.username;
  const [users, setUsers] = useState([]);
  // const loggedInUser = "65c44c79ac67152520d0897b";
  // const [loggedInUser, setLoggedInUser] = useState();
  const [followed, setFollowed] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState();

  useEffect(() => {
    if (logInUser) {
      const fetchData = async () => {
        // const response = await fetch({`/user/${userName}/suggestions`},)
        const response = await fetch(`/user/${userName}/suggestions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        //   console.log("suggestedUsers", data.suggestedUsers);
        setUsers(data.suggestedUsers);
      };
      fetchData();
    }
  }, [logInUser, userName]);

  const handleFollow = async (user) => {
    // console.log("user", user);
    const response = await fetch(`/user/${logInUser._id}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToBeFollowed: `${user._id}` }),
    });
    const data = await response.json();
    // console.log("follow data", data);
    if (response.status === 200) {
      // setFollowed(true);
      setSuggestedUser(data.followedUser);
      // setUserName(data.followingUser.username);
      setFollowed(true);
    }
  };

  const handleUnfollow = async (user) => {
    // console.log("user", user);
    const response = await fetch(`/user/${logInUser._id}/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToBeUnfollowed: `${user._id}` }),
    });
    const data = await response.json();
    // console.log("unfollow data", data);
    if (response.status === 200) {
      // setFollowed(false);
      setSuggestedUser(data.unFollowedUser);
      // setLoggedInUser(data.unFollowingUser);
      setFollowed(false);
    }
  };

  return (
    <div className="text-[13px] p-4">
      <div className="text-sm font-semibold text-gray-500">
        Suggested for you
      </div>
      <div className="flex flex-col gap-3 pt-4">
        {!users ? (
          <div className="w-64 h-72 flex justify-center items-center">
            no suggestions
          </div>
        ) : users.length === 0 ? (
          <div className="w-64 h-72 flex justify-center items-center">
            no suggestions
          </div>
        ) : users.length > 0 ? (
          users.map((item, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center w-64"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-11 h-11 object-contain rounded-full overflow-hidden border">
                    <img src={item.profilePicture} alt="img" />
                  </div>
                  <Link
                    className="font-semibold"
                    to={`/account/${item.username}`}
                  >
                    {item.username}
                  </Link>
                </div>
                {suggestedUser && item._id === suggestedUser._id ? (
                  followed ? (
                    <button
                      className="bg-gray-100  hover:bg-gray-200 font-semibold text-xs rounded-md py-[6px] px-3"
                      onClick={() => handleUnfollow(item)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="bg-[#0095F6] text-[#fff] hover:bg-[#0073f6] font-semibold text-xs rounded-md py-[6px] px-3"
                      onClick={() => handleFollow(item)}
                    >
                      Follow
                    </button>
                  )
                ) : (
                  <button
                    className="bg-[#0095F6] text-[#fff] hover:bg-[#0073f6] font-semibold text-xs rounded-md py-[6px] px-3"
                    onClick={() => handleFollow(item)}
                  >
                    Follow
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="w-64 h-72 flex justify-center items-center">
            loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
