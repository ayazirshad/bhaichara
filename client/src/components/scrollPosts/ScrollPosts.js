import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import loader from "./loader.gif";
import { Link } from "react-router-dom";

const ScrollPosts = ({ logInUser }) => {
  const [posts, setPosts] = useState([]);
  // console.log("posts", posts);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/post/get/${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setPosts(posts.concat(data.posts));
      setPage(page + 1);
      setTotalPosts(data.totalPosts);
    };
    fetchPosts();
  }, []);

  const fetchMorePosts = async () => {
    const response = await fetch(`/post/get/${page}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setPosts(posts.concat(data.posts));
    setPage(page + 1);
  };

  return (
    <InfiniteScroll
      className="overflow-y-auto"
      dataLength={posts.length}
      next={fetchMorePosts}
      hasMore={posts.length < totalPosts}
      loader={
        <div className="h-32 mb-32 flex justify-center items-center w-full sm:w-[430px]">
          <img src={loader} alt="loading" />
        </div>
      }
      endMessage={
        posts?.length !== 0 && (
          <p className="h-32 text-sm text-gray-500 mb-32 flex justify-center items-center w-full sm:w-[430px]">
            <b>Yay! You have seen it all</b>
          </p>
        )
      }
    >
      <div className="mb-20">
        {
          posts?.length > 0 && (
            <div>
              {posts.map((item, index) => {
                return <Post item={item} key={index} logInUser={logInUser} />;
              })}
            </div>
          )
          // : (
          //   <p className=" h-screen text-sm text-gray-500 mb-32 gap-5 flex flex-col justify-center items-center w-full sm:w-[430px] p-5 sm:p-0">
          //     <b>Hurryy!!!</b>
          //     <b>You Are The First One To Create The First Post</b>
          //     <Link
          //       to={"/create"}
          //       className="bg-[#0095F6] text-[#fff] sm:hover:bg-[#0073f6] text-lg px-3 py-1 rounded-md"
          //     >
          //       Create First Post
          //     </Link>
          //   </p>
          // )
        }
      </div>
    </InfiniteScroll>
  );
};

export default ScrollPosts;
