import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  const navigate = useNavigate();

  const loggingIn = async (e) => {
    e.preventDefault();
    const logInDetail = {
      email,
      password,
    };

    const res = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logInDetail),
    });
    const data = await res.json();
    if (res.status === 404) {
      setLoginMsg(data.msg);
    }
    console.log(logInDetail);
    console.log(data);
    if (data.loggedIn === true) {
      setIsAuthenticated(true);
      navigate("/");
    }
  };
  return (
    <div className="w-full flex justify-center py-10  h-screen items-center">
      <div className="w-72 p-8 flex flex-col gap-9  shadow-2xl border rounded-md bg-[#fff]">
        <h1 className="text-xl font-bold text-center">BhaiChara</h1>
        <form onSubmit={(e) => loggingIn(e)}>
          <input
            type="email"
            className="px-3 text-sm w-full py-2 mb-3 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="px-3 text-sm w-full py-2 mb-4 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
              placeholder="password"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          >
            Login
          </button>
          {loginMsg !== "" && (
            <p className="text-center text-xs text-red-500 mt-2 font-semibold">
              {loginMsg}
            </p>
          )}
        </form>
        <p className="text-xs text-center">
          Don't have account?{" "}
          <Link to={"/signup"} className="text-[#1897F6] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
