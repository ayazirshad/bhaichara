import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

const Comment = ({ commentId, handleDeleteComment, logInUser }) => {
  const logInUserId = logInUser._id;
  const [comment, setComment] = useState();

  useEffect(() => {
    if (commentId) {
      const fetchComment = async () => {
        const res = await fetch(`/comment/${commentId}/commentId`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setComment(data);
      };
      fetchComment();
    }
  }, [commentId]);

  return (
    <div>
      {comment ? (
        <div className="flex gap-2 text-sm sm:w-[430px] px-3">
          <div className="w-8 h-8 object-contain rounded-full overflow-hidden border">
            <img src={comment.user?.profilePicture} alt="img" />
          </div>
          <div className="text-justify flex-1">
            <Link
              className="font-semibold"
              to={`/account/${comment.user?.username}`}
            >
              {comment.user?.username}
            </Link>{" "}
            {comment.text}
          </div>
          {logInUserId === comment.user?._id && (
            <div>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className=" rounded-full hover:bg-gray-200 transition-all duration-100"
              >
                <MdDeleteOutline size={18} className="m-1" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[13px]">loading...</div>
      )}
    </div>
  );
};

export default Comment;
