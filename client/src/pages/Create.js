import React, { useRef, useState } from "react";
import ImageCropper from "../components/imageCrop/ImageCropper";
import { useNavigate } from "react-router-dom";
import { FaRegImage } from "react-icons/fa6";

const Create = ({ logInUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [tempImage, setTempImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [isImageCropperOn, setIsImageCropperOn] = useState(false);
  const formData = new FormData();

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
    <div className="w-full flex justify-center items-center mb-32">
      {(image !== "" || isImageCropperOn) && (
        <ImageCropper
          image={tempImage}
          onCancel={onCancel}
          setCroppedImage={setCroppedImage}
          setIsImageCropperOn={setIsImageCropperOn}
        />
      )}
      <div className=" w-full flex justify-center items-center flex-col p-5">
        <div className="w-full sm:w-96 flex justify-center items-center flex-col">
          <div className="w-full">
            <input
              type="text"
              className="px-3 text-sm w-full py-2 mb-4  outline-none border-b focus:border-b-blue-500  border-b-[#d9d9d9]"
              placeholder="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          {image !== "" || croppedImage !== "" ? (
            <>
              <div className="aspect-square w-full sm:w-96">
                <img
                  className="w-full h-full"
                  src={croppedImage !== "" ? croppedImage : image}
                  alt="postImage"
                />
              </div>
              <div className="text-center mt-2">
                <button
                  className="py-2 px-8 rounded-md bg-blue-300 hover:bg-blue-400 transition-all duration-200 text-sm "
                  onClick={() => setIsImageCropperOn(true)}
                >
                  Crop again
                </button>
              </div>
            </>
          ) : (
            <div className="aspect-square w-full sm:w-96 bg-gray-200">
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
        {(image !== "" || croppedImage !== "") && (
          <div className="text-center mt-3">
            <button
              className="bg-blue-300 py-2 px-8 rounded-md hover:bg-blue-400 transition-all font-semibold duration-200"
              onClick={uploadPost}
            >
              {loading ? "posting..." : "Post"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
