import React, { useState } from "react";

const CrowdCount = () => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const [crowdCount, setCrowdCount] = useState(null); // State to store the result
    const [error, setError] = useState(null); // State to track errors

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]); // Store the uploaded file
        setCrowdCount(null); // Reset previous result
        setError(null); // Reset previous errors
    };

    const handleCrowdCount = async () => {
        if (!image) {
            alert("Please upload an image before proceeding.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        setIsLoading(true); // Show loading indicator
        setCrowdCount(null); // Reset previous result
        setError(null); // Reset errors

        try {
            const response = await fetch("http://localhost:5001/api/face/crowd-count", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setCrowdCount(data.crowdCount); // Update result
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error fetching crowd count:", error);
            setError("An error occurred while processing the request.");
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Crowd Counting</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginBottom: "10px" }}
            />
            <br />
            <button
                onClick={handleCrowdCount}
                disabled={isLoading}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                }}
            >
                {isLoading ? "Processing..." : "Count Crowd"}
            </button>

            {/* Display Results */}
            {crowdCount !== null && (
                <div style={{ marginTop: "20px", color: "green" }}>
                    <h3>Estimated Crowd Count: {crowdCount}</h3>
                </div>
            )}

            {/* Display Errors */}
            {error && (
                <div style={{ marginTop: "20px", color: "red" }}>
                    <h3>Error: {error}</h3>
                </div>
            )}
        </div>
    );
};

export default CrowdCount;
