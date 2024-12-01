import React, { useState } from "react";

const CrowdCount = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]); // Store the uploaded file
    };

    const handleCrowdCount = async () => {
        if (!image) {
            alert("Please upload an image before proceeding.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5001/api/face/crowd-count", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Estimated Crowd Count: ${data.crowdCount}`);
            } else {
                alert(`Error: ${data.error || "Something went wrong"}`);
            }
        } catch (error) {
            console.error("Error fetching crowd count:", error);
            alert("An error occurred while processing the request.");
        }
    };

    return (
        <div>
            <h2>Crowd Counting</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleCrowdCount}>Count Crowd</button>
        </div>
    );
};

export default CrowdCount;
