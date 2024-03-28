import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import ImageCropper from "../components/imageCrop/ImageCropper";

const EditProfile = ({ logInUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setloggedInUser] = useState({});
  const [newUserName, setNewUserName] = useState("");
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [image, setImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [isImageCropperOn, setIsImageCropperOn] = useState(false);
  const formData = new FormData();

  const fileInputRef = useRef(null);

  const handleClick = () => {
    // Trigger click on the hidden file input
    fileInputRef.current.click();
  };
  useEffect(() => {
    if (logInUser) {
      const fetchUser = async () => {
        const res = await fetch(`/user/${logInUser._id}/userId`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setloggedInUser(data);
        setNewUserName(data.username);
        setNewBio(data.bio);
        setNewName(data.name);
      };
      fetchUser();
    }
  }, [logInUser]);

  const handleUpdate = async () => {
    setLoading(true);
    formData.append("username", newUserName);
    formData.append("name", newName);
    formData.append("bio", newBio);
    formData.append("image", croppedImage !== "" ? croppedImage : image);

    const res = await fetch(`/user/${loggedInUser?._id}/update`, {
      method: "PUT",
      body: formData,
    });
    if (res.status === 201) {
      console.log("updated");
      setLoading(false);
      navigate("/profile");
    }
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onCancel = () => {
    setImage("");
  };

  return (
    <div className=" w-full flex justify-center">
      <div className=" my-10 flex flex-col items-center gap-6 px-5 py-10 rounded-2xl shadow-2xl">
        <div className="relative">
          <div className=" w-40 h-40 overflow-hidden rounded-full ">
            <img
              src={
                croppedImage !== "" ? croppedImage : loggedInUser.profilePicture
              }
              alt="img"
              className="w-full h-full"
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <button
              className="absolute right-2 bottom-1 bg-[#fff] p-2 rounded-full shadow-lg text-gray-600"
              onClick={handleClick}
            >
              <MdEdit size={21} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-80">
          <label htmlFor="username" className="text-sm px-3">
            Username:
          </label>
          <input
            type="text"
            className="px-3 py-2 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="username"
            required
            defaultValue={loggedInUser.username}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <label htmlFor="username" className="text-sm px-3">
            Name:
          </label>
          <input
            type="name"
            className="px-3 py-2 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="name"
            defaultValue={loggedInUser.name || ""}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <label htmlFor="username" className="text-sm px-3">
            Bio:
          </label>
          <input
            type="name"
            className="px-3 py-2 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="bio"
            defaultValue={loggedInUser.bio || ""}
            onChange={(e) => setNewBio(e.target.value)}
          />
        </div>
        <div className="w-full">
          <button
            className={`w-full py-3 text-sm bg-blue-600 rounded-full hover:bg-blue-500 transition-all duration-200 text-[#fff] `}
            onClick={handleUpdate}
          >
            {loading ? "updating..." : "Update"}
          </button>
        </div>
      </div>
      {(image !== "" || isImageCropperOn) && (
        <div>
          <ImageCropper
            image={image}
            onCancel={onCancel}
            setCroppedImage={setCroppedImage}
            setIsImageCropperOn={setIsImageCropperOn}
          />
        </div>
      )}
    </div>
  );
};

export default EditProfile;
