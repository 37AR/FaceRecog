import React, { useState, useRef, useEffect } from "react";

const SoloRegister = () => {
  const [name, setName] = useState("");
  const [numImages, setNumImages] = useState(15); // Default: 15 images
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedCount, setCapturedCount] = useState(0);  // State to track the captured images count
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Handlers for the input fields
  const handleNameChange = (e) => setName(e.target.value);
  const handleNumImagesChange = (e) => setNumImages(e.target.value);

  // Start Camera
  const handleStartCamera = async () => {
    if (!videoRef.current) {
      console.error("Video element is not ready yet.");
      setErrorMessage("Camera could not be initialized. Please try again.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; // Store the stream to stop it later
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsCameraActive(true);
      console.log("Camera started successfully.");
    } catch (err) {
      console.error("Camera access error details:", err);
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
    }
  };

  // Stop Camera
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks(); // Get all media tracks
      tracks.forEach((track) => track.stop()); // Stop each track
      videoRef.current.srcObject = null; // Clear the video element's source
      streamRef.current = null; // Clear the stored stream reference
      setIsCameraActive(false);
      console.log("Camera stopped successfully!");
    } else {
      console.warn("Camera is already stopped or was never started.");
    }
  };

  // Register Face
  const handleRegisterFace = async () => {
    if (!name) {
      setErrorMessage("Name is required for registration");
      return;
    }
    if (numImages <= 0 || numImages === "") {
      setErrorMessage("Number of images must be greater than 0");
      return;
    }
    if (!isCameraActive) {
      setErrorMessage("Please start the camera before registering");
      return;
    }
  
    setErrorMessage(""); // Clear previous errors
  
    const capturedFaceEncodings = []; // Store face encodings
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
  
    let attemptCount = 0; // Track the total number of attempts
    try {
      // Continue capturing until the required number of images is reached
      while (capturedFaceEncodings.length < numImages) {
        try {
          setErrorMessage(""); // Clear error message for each attempt
          attemptCount++;
  
          // Capture image from video stream
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL("image/jpeg"); // Base64-encoded image
  
          // Send the captured image to the server to generate the face encoding
          const response = await fetch("http://localhost:5001/api/face/generate-embeddings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              frame: imageData, // Send base64 image
            }),
          });
  
          console.log(`Attempt ${attemptCount}: Sent frame to Python`);
          const result = await response.json();
  
          if (result.faceDetected) {
            // Add the detected face encoding
            capturedFaceEncodings.push(result.faceEncoding);
            setCapturedCount(capturedFaceEncodings.length); // Update the captured count
            console.log(`Face encoding generated (${capturedFaceEncodings.length}/${numImages})`);
          } else {
            console.log(`No face detected in attempt ${attemptCount}. Retrying...`);
            setErrorMessage("No face detected, continuing...");
          }
  
          // Add a delay for better variance between captures
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error("Error while capturing face:", error);
          setErrorMessage("Error capturing face. Retrying...");
        }
      }
  
      console.log("Required number of face images captured successfully.");
  
      // Calculate the average face encoding
      const averageFaceEncoding = calculateAverageEmbedding(capturedFaceEncodings);
  
      // Prepare the data to be sent to the backend
      const data = {
        label: name, // Name of the person
        faceEncoding: averageFaceEncoding, // Average face encoding
      };
      console.log(data.faceEncoding);
  
      // Ensure you are getting the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token missing. Please log in.");
        return;
      }
  
      // Send the data to the backend with the token in the headers
      const response = await fetch("http://localhost:5000/api/face/register-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Include the token in the request header
        },
        body: JSON.stringify(data), // Send face encodings and label
      });
      console.log("Sent embedding to Backend");
  
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert(`${name} registered successfully!`);
        } else {
          console.error(result.message);
          setErrorMessage(result.message);
        }
      } else {
        // Handle non-200 responses
        const errorText = await response.text();
        console.error("Error from server:", errorText);
        setErrorMessage("Failed to register face. Please try again.");
      }
    } catch (error) {
      console.error("Error during face registration:", error);
      setErrorMessage("Failed to register face. Please try again.");
    }
  };
  
  // Function to calculate the average of the face embeddings
  const calculateAverageEmbedding = (embeddings) => {
    const numDimensions = embeddings[0].length;  // Assuming all embeddings have the same length
    const average = new Array(numDimensions).fill(0);  // Initialize an array of zeros

    // Sum all embeddings for each dimension
    embeddings.forEach(embedding => {
      embedding.forEach((value, index) => {
        average[index] += value;
      });
    });

    // Calculate the average for each dimension
    return average.map(sum => sum / embeddings.length);
  };



  // Ensure videoRef is ready when `isCameraActive` changes
  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      handleStartCamera();
    }
    return () => {
      if (isCameraActive) {
        handleStopCamera();
      }
    };
  }, [isCameraActive]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Individual Face Registration</h1>

      {/* Input for name */}
      <div style={styles.inputGroup}>
        <label htmlFor="name" style={styles.label}>
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          style={styles.input}
          placeholder="Enter your name"
        />
      </div>

      {/* Input for number of images */}
      <div style={styles.inputGroup}>
        <label htmlFor="numImages" style={styles.label}>
          Number of Images:
        </label>
        <input
          type="number"
          id="numImages"
          value={numImages}
          onChange={handleNumImagesChange}
          style={styles.input}
          placeholder="Enter number of images"
          min="1"
        />
      </div>

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

      {/* Button and Captured Images Count Section */}
      <div style={styles.buttonContainer}>
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
            style={styles.button}
            disabled={!isCameraActive}
          >
            Stop Camera
          </button>
        </div>

        <div style={styles.imageCountContainer}>
          {/* Show the number of images captured */}
          <p style={styles.imageCountText}>
            Images Captured: {capturedCount}/{numImages}
          </p>
        </div>

        <div style={styles.registerButtonContainer}>
          <button onClick={handleRegisterFace} style={styles.button}>
            Register Face
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
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "16px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  errorMessage: {
    color: "red",
    marginBottom: "15px",
    fontSize: "14px",
    fontWeight: "600",
  },
  cameraContainer: {
    width: "100%",
    height: "100%",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ddd",
    backgroundColor: "#f7f7f7",
  },
  placeholder: {
    fontSize: "18px",
    color: "#666",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  buttonsRow: {
    display: "flex",
    gap: "10px",  // Add space between buttons
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  imageCountContainer: {
    marginBottom: "20px",
    textAlign: "center",  // Center the text
  },
  imageCountText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  registerButtonContainer: {
    marginTop: "20px",
  }
};


export default SoloRegister;
