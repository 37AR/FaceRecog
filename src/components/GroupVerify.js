import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from './CSS_SoloVerify';

const GroupVerify = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResults, setVerificationResults] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start Camera

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


  // Handle Face Verification
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
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      console.log("Image captured for verification!");

      // Send frame to Flask server for face embedding generation
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

      // Send embeddings to the backend for verification
      const token = sessionStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token missing. Please log in.");
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
      if (verificationResponse.ok && verificationResult.name) {
        setVerificationResults((prevResults) => {
          if (!prevResults.some(face => face.name === verificationResult.name)) {
            return [
              ...prevResults,
              { name: verificationResult.name, id: verificationResult.details._id }
            ];
          }
          return prevResults;
        });
      } else {
        setErrorMessage("No matches found for the group image.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setErrorMessage("Failed to verify faces. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isCameraActive]);

  // Stop Verification
  const handleStopVerification = useCallback(() => {
    setCapturing(false);
    console.log("Verification stopped.");
  }, []);

  // Handle Capturing State
  useEffect(() => {
    let interval;
    if (capturing) {
      interval = setInterval(() => {
        handleVerifyFaces();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [capturing, handleVerifyFaces]);

  // Camera Lifecycle Management
  useEffect(() => {
    if (isCameraActive) {
      handleStartCamera();
    } else {
      handleStopCamera();
    }
    return () => handleStopCamera();
  }, [isCameraActive, handleStartCamera, handleStopCamera]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Group Face Verification</h1>

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
          <h5>Recognized Faces:</h5>
          <ul style={styles.resultList}>
            {verificationResults.map((face) => (
              <li key={face.id} style={styles.resultItem}>
                {face.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buttons */}
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
          onClick={() => setCapturing(true)}
          style={{ ...styles.button, backgroundColor: 'teal' }}
          disabled={!isCameraActive || capturing || isLoading}
        >
          {capturing ? "Verifying": "Verify"}
        </button>
        <button
          onClick={handleStopVerification}
          style={{ ...styles.button, backgroundColor: 'purple' }}
          disabled={!capturing}
        >
          Stop Verification
        </button>
      </div>
    </div>
  );
};

export default GroupVerify;