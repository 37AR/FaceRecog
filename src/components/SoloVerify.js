import React, { useState, useRef, useEffect, useCallback } from "react";

const SoloVerify = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState("");
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

  // Verify Face
  const handleVerifyFace = async () => {
    if (!isCameraActive) {
      setErrorMessage("Please start the camera before verifying.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    try {
      // Capture image from video stream
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      console.log('Image Captured for Verification!');


      // Generate embeddings
      const embeddingResponse = await fetch(
        "http://localhost:5001/api/face/generate-embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            frame: imageData,
          }),
        }
      );

      const embeddingResult = await embeddingResponse.json();
      if (!embeddingResponse.ok || !embeddingResult.faceDetected) {
        console.error("Error in embedding generation:", embeddingResult.message);
        setErrorMessage(embeddingResult.message || "Failed to generate embeddings.");
        setIsLoading(false);
        return;
      }

      console.log('Embeddings generated for Verification Image!');
      const faceEmbedding = embeddingResult.faceEncoding;

      // Verify embedding with backend
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token missing. Please log in.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        setIsLoading(false);
        return;
      }

      const verificationResponse = await fetch(
        "http://localhost:5000/api/face/verify-face",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            embedding: faceEmbedding,
          }),
        }
      );

      const verificationResultData = await verificationResponse.json();

      if (verificationResponse.ok && verificationResultData.name) {
        setVerificationResult(`Person identified: ${verificationResultData.name}`);
      } else {
        setVerificationResult("Unknown person.");
      }
    } catch (error) {
      console.error("Error during face verification:", error);
      setErrorMessage("Failed to verify face. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      <h1 style={styles.header}>Verify Face</h1>

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

        {/* Verification Result */}
        {verificationResult && (
          <div style={styles.resultMessage}>{verificationResult}</div>
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
            onClick={handleVerifyFace}
            style={{ ...styles.button, backgroundColor: 'teal' }}
            disabled={!isCameraActive || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Face'}
          </button>
        </div>
      </div>


    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: 'Kumbh Sans',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: '-50px',
    color: '#2c3e50',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '20px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraContainer: {
    width: '100%',
    height: '400px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ddd',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
  },
  placeholder: {
    fontSize: '18px',
    color: '#666',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    flex: '1', // Ensures buttons have equal width
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    textAlign: 'center',
  },
  resultMessage: {
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
};


export default SoloVerify;
