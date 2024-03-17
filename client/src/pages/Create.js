import React, { useRef, useState } from "react";
import ImageCropper from "../components/imageCrop/ImageCropper";
import { useNavigate } from "react-router-dom";
import { FaRegImage } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

const Create = ({ logInUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [isImageCropperOn, setIsImageCropperOn] = useState(false);
  // console.log("caption", caption);
  // console.log("croppedimage", croppedImage);
  const formData = new FormData();
  // console.log("image", image);

  const uploadPost = async () => {
    if (image !== "" || croppedImage !== "") {
      setLoading(true);
      formData.append("caption", caption);
      formData.append("image", croppedImage);
      formData.append("user", logInUser?._id);
      if (croppedImage !== "") {
        const res = await fetch("/post/create", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setLoading(false);
          navigate("/");
        }
      } else {
        alert("no cropped image selected");
      }
    } else {
      alert("no image selected");
    }
    // console.log("create data", data);
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
        setTempImage(reader.result);
        formData.append("profile", reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onCancel = () => {
    setImage("");
  };
  const fileInputRef = useRef(null);
  const handleClick = () => {
    // Trigger click on the hidden file input
    fileInputRef.current.click();
  };

  return (
    <div className="w-full flex justify-center items-center ">
      {(image !== "" || isImageCropperOn) && (
        <ImageCropper
          image={tempImage}
          onCancel={onCancel}
          setCroppedImage={setCroppedImage}
          setIsImageCropperOn={setIsImageCropperOn}
        />
      )}
      <div>
        <div className=" p-5 flex  gap-5">
          <div>
            {/* <label htmlFor="caption">Caption</label> */}
            <input
              type="text"
              className="px-3 text-sm w-full py-2 mb-4 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
              placeholder="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          {/* <div>
            <label htmlFor="">
              <FaRegImage />
            </label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handleFileSelect(e)}
            />
          </div> */}
          {image !== "" || croppedImage !== "" ? (
            <>
              <div className="w-56 h-56">
                <img
                  className="w-full h-full"
                  src={croppedImage !== "" ? croppedImage : image}
                  alt="postImage"
                />
              </div>
              <div>
                <button
                  className="px-3 py-1 rounded-md bg-blue-300"
                  onClick={() => setIsImageCropperOn(true)}
                >
                  Crop
                </button>
              </div>
            </>
          ) : (
            <div className="w-56 h-56 bg-gray-200">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <button
                className="w-full h-full p-2 flex justify-center flex-col  items-center shadow-lg text-gray-600"
                onClick={handleClick}
              >
                <FaRegImage size={21} />
                <label htmlFor="image">choose image</label>
              </button>
            </div>
          )}
        </div>
        <button
          className="bg-blue-300 p-3 rounded-md hover:bg-blue-400 transition-all duration-300"
          onClick={uploadPost}
        >
          {loading ? "posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default Create;
