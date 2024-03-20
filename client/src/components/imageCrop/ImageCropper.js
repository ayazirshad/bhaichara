import React, { useState } from "react";
import Cropper from "react-easy-crop";
import "./ImageCropper.css";
import getCroppedImg from "./CropImage";

const ImageCropper = ({
  image,
  onCancel,
  setCroppedImage,
  setIsImageCropperOn,
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const aspect = { value: 1 / 1 };
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };
  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const onCrop = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setCroppedImage(reader.result);
      }
    };
    if (croppedImage) {
      reader.readAsDataURL(croppedImage);
    }
  };

  return (
    <div className="z-30">
      <div className="backdrop"></div>
      <div className="crop-container bg-gray-600">
        <Cropper
          image={image}
          zoom={zoom}
          crop={crop}
          aspect={aspect.value}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="controls bg-[#fff] bottom-0 flex gap-10 py-5">
        <button
          className="px-3 bg-red-400 rounded-md"
          onClick={() => {
            onCancel();
            setIsImageCropperOn(false);
          }}
        >
          Cancel
        </button>
        <button
          className="px-3 bg-green-400 rounded-md"
          onClick={() => {
            onCrop();
            onCancel();
            setIsImageCropperOn(false);
          }}
        >
          Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
