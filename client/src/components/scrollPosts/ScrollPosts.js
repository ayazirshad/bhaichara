import React, { useEffect, useState } from "react";
import Post from "../post/Post";

const ScrollPosts = ({ logInUser }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/post", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div className="pb-20">
      {posts.length > 0 ? (
        <div>
          {posts.map((item, index) => {
            return <Post item={item} key={index} logInUser={logInUser} />;
          })}
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center w-[430px]">
          loading...
        </div>
      )}
    </div>
  );
};

export default ScrollPosts;
