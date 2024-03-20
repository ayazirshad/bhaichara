import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/post/Post";

const PersonalPost = ({ logInUser }) => {
  const params = useParams();
  const id = params.postId;
  const [post, setPost] = useState();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/post/${id}/postId`, {
        mathod: "GET",
        "Content-Type": "application/json",
      });
      const data = await res.json();
      setPost(data);
    };
    fetchPost();
  }, [id]);
  return (
    <div className="w-full pb-10  flex justify-center">
      <div>{post && <Post item={post} logInUser={logInUser} />}</div>
    </div>
  );
};

export default PersonalPost;
