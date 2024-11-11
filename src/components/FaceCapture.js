import React, { useRef } from 'react';

const FaceCapture = ({ onCapture }) => {
  const videoRef = useRef(null);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    onCapture(imageData);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="300" height="300"></video>
      <button onClick={captureImage}>Capture Face</button>
    </div>
  );
};

export default FaceCapture;
