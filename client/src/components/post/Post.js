import React, { useEffect, useRef, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Comment from "./Comment";
import { IoMdCrop } from "react-icons/io";

const Post = ({ item, logInUser }) => {
  const location = useLocation();
  const inputRef = useRef(null);
  // console.log("location.pathname", );
  const navigate = useNavigate();
  const logInUserId = logInUser?._id;
  const [loggedInUser, setLoggedInUser] = useState();
  const userId = loggedInUser && loggedInUser._id;
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [post, setPost] = useState(item);
  const [commentText, setCommentText] = useState("");
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [isShowLikesOpen, setisShowLikesOpen] = useState(false);
  // console.log("post", item);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/user/${logInUserId}/userId`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setLoggedInUser(data);
    };
    fetchUser();
  }, [logInUserId]);

  const likePost = async () => {
    // console.log("like function", post._id, userId);
    const response = await fetch(`/post/${post._id}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    setPost(data);
    setLiked(true);
  };

  const unLikePost = async () => {
    // console.log("unlike function", post._id, userId);
    const response = await fetch(`/post/${post._id}/unlike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    // console.log("unliked post", data);
    setPost(data);
    setLiked(false);
  };

  const comment = async () => {
    const newComment = {
      userId: logInUser?._id,
      text: commentText,
      createdAt: new Date(),
    };
    // console.log("newComment", newComment);
    // console.log(post._id);

    const res = await fetch(`/post/${post?._id}/comment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });
    const data = await res.json();
    setPost(data);
    setCommentText("");
    // console.log("data", data);
  };

  const handleDeleteComment = async (commentId) => {
    const id = {
      commentId,
    };
    const res = await fetch(`/post/${post?._id}/deleteComment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    // console.log("res", res);
    const data = await res.json();
    setPost(data);
    // console.log("handleDeleteComment", data);
  };

  const handleDeletePost = async () => {
    const res = await fetch(`/post/${post?._id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data = await res.json();
    // console.log(data);
    if (res.status === 201) {
      setIsDeleteMenuOpen(!isDeleteMenuOpen);
      navigate("/profile");
    }
  };

  const copyLink = async (postId) => {
    try {
      await navigator.clipboard.writeText(`/post/${postId}`);
      setIsDeleteMenuOpen(false);
      alert("copied to clipboard");
    } catch (e) {
      console.log(e);
      alert("error in copying");
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // const handleShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "Facebook",
  //         text: "open facebook",
  //         url: "https://facebook.com",
  //       });
  //       console.log("Successfully shared");
  //     } catch (error) {
  //       console.error("Error sharing:", error);
  //     }
  //   } else {
  //     console.log("Web Share API not supported on this browser");
  //     // Handle fallback behavior, e.g., show a custom share dialog
  //   }
  // };

  return (
    <div className="bg-[#fff]">
      {post ? (
        <div className="relative py-3 border-b border-b-gray-300 mb-3 ">
          <div className="relative flex justify-between items-center py-2 pr-1 pl-[10px]">
            <div className="flex gap-2 items-center">
              <div className="w-9 h-9 object-contain rounded-full overflow-hidden border">
                <img src={post.user?.profilePicture} alt="img" />
              </div>
              <Link
                className="text-sm font-semibold"
                to={
                  post.user.username === loggedInUser?.username
                    ? `/profile`
                    : `/account/${post.user.username}`
                }
              >
                {post.user.username}
              </Link>
            </div>
            <div>
              <button className="hover:bg-gray-200 transition-all duration-100 rounded-full">
                <BiDotsHorizontalRounded
                  size={21}
                  className="m-1"
                  onClick={() => setIsDeleteMenuOpen(!isDeleteMenuOpen)}
                />
              </button>
            </div>
            {isDeleteMenuOpen && (
              <div className="absolute text-[13px] bg-[#fff] border shadow-xl top-10 right-5 py-[6px] rounded-md flex flex-col">
                {post?.user?._id === loggedInUser?._id &&
                  location.pathname.startsWith("/post/") && (
                    <button
                      className="py-2 px-10 text-red-500 hover:bg-gray-200 transition-all duration-100"
                      onClick={handleDeletePost}
                    >
                      Delete
                    </button>
                  )}
                {location.pathname === "/" && (
                  <Link
                    className="py-2 px-10  hover:bg-gray-200 transition-all duration-100"
                    to={`/post/${post._id}`}
                  >
                    Go to post
                  </Link>
                )}
                <button
                  className="py-2 px-10 hover:bg-gray-200 transition-all duration-100"
                  onClick={() => copyLink(post._id)}
                >
                  Copy link
                </button>
              </div>
            )}
          </div>
          <div className="aspect-square w-full sm:w-[430px]">
            <img src={post.image} alt="img" className="w-full h-full" />
          </div>
          <div className="flex justify-between items-center py-[10px] px-3">
            <div className="flex gap-4 items-center">
              {liked ||
              (post &&
                loggedInUser &&
                post.likes.some(
                  (element) => element._id === loggedInUser._id
                )) ? (
                <button onClick={unLikePost}>
                  <FaHeart size={21} title="Unlike" className="text-red-500" />
                </button>
              ) : (
                <button onClick={likePost}>
                  <FaRegHeart size={21} title="Like" />
                </button>
              )}
              <button onClick={focusInput}>
                <FaRegComment size={21} title="Comment" />
              </button>
            </div>
            <button>
              <PiPaperPlaneTiltBold size={21} title="Share" />
            </button>
          </div>
          <button
            className="flex gap-1 text-[13px] px-3 font-semibold"
            onClick={() => setisShowLikesOpen(!isShowLikesOpen)}
          >
            <p>{post.likes.length}</p>
            <h4> likes</h4>
          </button>
          <div className="flex gap-1 text-[13px] px-3 py-[2px]">
            <p>
              <strong className="font-semibold">{post.user.username}</strong>
              &nbsp;&nbsp;
              {post.caption}
            </p>
          </div>
          {post.comments.length > 0 && (
            <>
              <div className="text-[13px] px-3">
                {showComments ? (
                  <button onClick={() => setShowComments(!showComments)}>
                    Hide comments
                  </button>
                ) : (
                  <button onClick={() => setShowComments(!showComments)}>
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
              {showComments && (
                <div className="flex flex-col gap-3 mt-3 max-h-72 overflow-y-auto ">
                  {post.comments.map((comment, index) => {
                    return (
                      <Comment
                        commentId={comment._id}
                        key={index}
                        handleDeleteComment={handleDeleteComment}
                        logInUser={logInUser}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
          <div className="flex mt-1 px-3">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="outline-none text-[13px] w-full"
              placeholder="Add a comment..."
            />
            {commentText && (
              <button
                onClick={comment}
                className="text-sm text-[#006ff6] hover:text-[#0094f6d3] font-semibold"
              >
                Post
              </button>
            )}
          </div>
          {post.likes.length > 0 && isShowLikesOpen && (
            <div className="w-full h-screen bg-black  flex-col bg-opacity-10 backdrop-blur-md z-30 top-0 fixed flex justify-center items-center">
              <div className="text-right text-white">
                <button onClick={() => setisShowLikesOpen(!isShowLikesOpen)}>
                  close
                </button>
              </div>
              <div className="bg-[#fff] w-64 p-3 rounded-md">
                {post.likes.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center w-full "
                    >
                      <div className="flex gap-2 items-center my-1">
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-[430px] h-[430px]">loading...</div>
      )}
    </div>
  );
};

export default Post;
