import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Signup = () => {
  const [users, setUsers] = useState([]);
  const [emailPresent, setEmailPresent] = useState();
  const [userNamePresent, setuserNamePresent] = useState();
  const [emailTouched, setEmailTouched] = useState(false);
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const checkEmail = (email) => {
    const filteredUsers = users.filter((item) => item.email === email);
    if (email !== "") {
      filteredUsers.length > 0 ? setEmailPresent(true) : setEmailPresent(false);
      setEmailTouched(true);
    } else {
      setEmailTouched(false);
    }
  };
  const checkUserName = (userName) => {
    const filteredUsers = users.filter((item) => item.username === userName);
    if (userName !== "") {
      filteredUsers.length > 0
        ? setuserNamePresent(true)
        : setuserNamePresent(false);
      setUserNameTouched(true);
    } else {
      setUserNameTouched(false);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
      username: userName,
    };

    const res = await fetch("/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    await res.json();
    if (res.status === 201) {
      setEmail("");
      setName("");
      setUserName("");
      setPassword("");
      navigate("/login");
    }
  };

  return (
    <div className="w-full flex justify-center py-10  h-screen items-center">
      <div className="w-72 p-8 flex flex-col gap-9  shadow-2xl border rounded-md bg-[#fff]">
        <h1 className="text-3xl font-bold font-insta text-center">BhaiChara</h1>
        <form onSubmit={(e) => registerUser(e)}>
          <div className="relative">
            <input
              type="email"
              className="px-3 text-sm  w-full py-2 mb-3 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
              placeholder="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                checkEmail(e.target.value);
              }}
            />
            {emailTouched && (
              <div className="absolute top-0 right-0 m-[10px]">
                {emailPresent ? (
                  <IoIosCloseCircle size={20} className="text-red-500 " />
                ) : (
                  <FaCircleCheck className="text-green-500 mx-[2px] my-[2px]" />
                )}
              </div>
            )}
          </div>
          <input
            type="name"
            className="px-3 text-sm w-full py-2 mb-3 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="relative">
            <input
              type="name"
              className="px-3 text-sm w-full py-2 mb-3 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
              placeholder="username"
              required
              maxLength={15}
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                checkUserName(e.target.value);
              }}
            />
            {userNameTouched && (
              <div className="absolute top-0 right-0 m-[10px]">
                {userNamePresent ? (
                  <IoIosCloseCircle size={20} className="text-red-500 " />
                ) : (
                  <FaCircleCheck className="text-green-500 mx-[2px] my-[2px]" />
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="px-3 text-sm w-full py-2 mb-4 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
              placeholder="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute top-0 right-0 m-[10px] text-gray-700">
              {showPassword ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  <IoMdEye size={20} />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  <IoMdEyeOff size={20} />
                </button>
              )}
            </div>
          </div>
          <button
            className={`w-full py-2 text-sm bg-blue-600 rounded-full hover:bg-blue-500 transition-all duration-200 text-[#fff] `}
            type="submit"
          >
            Sing up
          </button>
        </form>
        <p className="text-xs text-center">
          Have an account?{" "}
          <Link to={"/login"} className="text-[#1897F6] font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
