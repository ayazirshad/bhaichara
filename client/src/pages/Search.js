import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Search = ({ logInUser }) => {
  const [loggedInUser, setLoggedInUser] = useState(logInUser);
  const [users, setUsers] = useState([]);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [userPresent, setUserPresent] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [userChanged, setUserChanged] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/user");
      const data = await res.json();
      setFetchedUsers(data);
    };
    fetchUsers();
  }, []);

  const filterUsers = (searchValue) => {
    const filteredUsers = fetchedUsers?.filter((item) =>
      item.username.includes(searchValue)
    );
    if (searchValue !== "") {
      setUsers(filteredUsers);
      setUserPresent(true);
    } else {
      setUsers([]);
      setUserPresent(false);
    }
  };

  const handleFollow = async (user) => {
    const response = await fetch(`/user/${loggedInUser?._id}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToBeFollowed: `${user._id}` }),
    });
    const data = await response.json();
    console.log("follow data", data);
    if (response.status === 200) {
      setFollowed(true);
      setUserChanged(data.followedUser);
      setLoggedInUser(data.followingUser);
    }
  };

  const handleUnfollow = async (user) => {
    const response = await fetch(`/user/${loggedInUser?._id}/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToBeUnfollowed: `${user._id}` }),
    });
    const data = await response.json();
    console.log("unfollow data", data);
    if (response.status === 200) {
      setFollowed(false);
      setUserChanged(data.unFollowingUser);
      setLoggedInUser(data.unFollowingUser);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-80 py-10 bg-white flex flex-col gap-4">
        <input
          type="text"
          className="px-3  py-2 mb-5 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
          placeholder="Search users"
          onChange={(e) => filterUsers(e.target.value)}
        />

        {users.length > 0 ? (
          users.map((item, index) => {
            return (
              <div className="flex justify-between items-center" key={index}>
                <div className="flex gap-2 items-center">
                  <div className="w-11 h-11 object-contain rounded-full overflow-hidden border">
                    <img src={item.profilePicture} alt="img" />
                  </div>
                  <div>
                    <Link
                      className="font-semibold"
                      to={`/account/${item.username}`}
                    >
                      {item.username}
                    </Link>
                    <h3 className="text-[13px]">{item.name}</h3>
                  </div>
                </div>
                {item._id !== loggedInUser?._id &&
                  (loggedInUser?.following?.some(
                    (user) => user._id === item._id
                  ) || item._id === userChanged?._id ? (
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
                  ))}
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 w-full h-full flex justify-center items-center">
            <img
              src={
                userPresent
                  ? "https://img.freepik.com/premium-vector/male-user-avatar-icon-flat-design_1039903-154.jpg?size=626&ext=jpg&ga=GA1.1.716748698.1708178907&semt=ais"
                  : "https://img.freepik.com/premium-vector/cute-little-kid-use-computer-study-internet_97632-7335.jpg"
              }
              alt="search"
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
