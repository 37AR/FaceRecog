import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from './CSS_SoloVerify';

const GroupVerify = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResults, setVerificationResults] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start Camera
  const handleStartCamera = useCallback(async () => {
    if (!videoRef.current) {
      console.error("Video element is not ready yet.");
      setErrorMessage("Camera could not be initialized. Please try again.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsCameraActive(true);
      console.log("Camera started successfully.");
    } catch (err) {
      console.error("Camera access error details:", err);
      handleCameraError(err);
    }
  }, []);

  // Stop Camera
  const handleStopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      streamRef.current = null;
      setIsCameraActive(false);
      console.log("Camera stopped successfully!");
    } else {
      console.warn("Camera is already stopped or was never started.");
    }
  }, []);

  // Camera Error Handling
  const handleCameraError = (err) => {
    switch (err.name) {
      case "NotAllowedError":
        setErrorMessage(
          "Camera access is denied. Please enable it in your browser settings."
        );
        break;
      case "NotFoundError":
        setErrorMessage("No camera detected. Please connect a camera.");
        break;
      case "NotReadableError":
        setErrorMessage("Camera is being used by another application.");
        break;
      default:
        setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  // Verify Faces in Group
  // Verify Faces in Group
const handleVerifyFaces = useCallback(async () => {
  if (!isCameraActive) {
    setErrorMessage("Please start the camera before verifying.");
    return;
  }

  setErrorMessage("");
  setIsLoading(true);

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current?.videoWidth || 0;
  canvas.height = videoRef.current?.videoHeight || 0;
  const context = canvas.getContext("2d");

  try {
    // Capture image from video stream
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    console.log("Image Captured for Verification!");

    // Send the frame to Flask for face detection and embedding generation
    const embeddingResponse = await fetch(
      "http://localhost:5001/api/face/generate-embeddings-ptm",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: dataUrl }),
      }
    );

    const embeddingData = await embeddingResponse.json();

    if (!embeddingData.faceDetected) {
      setErrorMessage("No face detected. Please adjust your position.");
      return;
    }

    console.log("Embeddings generated for group image!");

    // If embeddings are generated, send them to the backend for verification
    const token = sessionStorage.getItem("token");
    if (!token) {
      setErrorMessage("Authentication token missing. Please log in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const verificationResponse = await fetch(
      "http://localhost:5000/api/face/verify-face-ptm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ embedding: embeddingData.faceEncoding }),
      }
    );

    const verificationResult = await verificationResponse.json();

    if (verificationResponse.ok && verificationResult.recognizedFaces) {
      setVerificationResults(verificationResult.recognizedFaces);

      // Log identified persons for debugging or display
      console.log("Identified Faces:", verificationResult.recognizedFaces);
    } else {
      setVerificationResults([]);
      setErrorMessage("No matches found for the group image.");
    }
  } catch (error) {
    console.error("Error during group verification:", error);
    setErrorMessage("Failed to verify faces. Please try again.");
  } finally {
    setIsLoading(false);
  }
}, [isCameraActive, videoRef]);

  

  // Manage Camera Lifecycle
  useEffect(() => {
    if (isCameraActive) {
      handleStartCamera();
    }
    return () => {
      if (isCameraActive) {
        handleStopCamera();
      }
    };
  }, [isCameraActive, handleStartCamera, handleStopCamera]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Group Face Verification</h1>

      {/* Card container */}
      <div style={styles.card}>
        {/* Error Message */}
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

        {/* Camera View */}
        <div style={styles.cameraContainer}>
          {isCameraActive ? (
            <video ref={videoRef} style={styles.video} autoPlay muted />
          ) : (
            <div style={styles.placeholder}>Camera is off</div>
          )}
        </div>

        {/* Verification Results */}
        {verificationResults.length > 0 && (
          <div style={styles.resultMessage}>
            <h2>Recognized Faces:</h2>
            <ul>
              {verificationResults.map((face, index) => (
                <li key={index}>{face.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons Section */}
        <div style={styles.buttonsRow}>
          <button
            onClick={() => setIsCameraActive(true)}
            style={styles.button}
            disabled={isCameraActive}
          >
            Start Camera
          </button>
          <button
            onClick={() => setIsCameraActive(false)}
            style={{ ...styles.button, backgroundColor: '#d40707d8' }}
            disabled={!isCameraActive}
          >
            Stop Camera
          </button>
          <button
            onClick={handleVerifyFaces}
            style={{ ...styles.button, backgroundColor: 'teal' }}
            disabled={!isCameraActive || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Faces'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupVerify;
