import base64
import io
from pyexpat import model
from tkinter import Image
import cv2
from flask import app, jsonify, request
import numpy as np

from backend.services.embeddings import preprocess_face


@app.route('/api/face/verify-multiple-faces', methods=['POST'])
def verify_multiple_faces():
    try:
        data = request.get_json()
        print("Received data!")  # Log the received data

        frame_data = data.get("frame")
        if not frame_data:
            return jsonify({"error": "No frame data received"}), 400

        # Decode the base64 frame
        img_bytes = base64.b64decode(frame_data.split(",")[1])  # Strip base64 header
        img = Image.open(io.BytesIO(img_bytes))
        frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

        # Detect faces
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 1.3, 5)

        if len(faces) == 0:
            return jsonify({"faces": [], "message": "No faces detected"}), 200

        results = []

        # Process each detected face
        for (x, y, w, h) in faces:
            face = frame[y:y+h, x:x+w]

            # Preprocess the face for your custom model
            face_preprocessed = preprocess_face(face)
            print("Preprocessed face shape:", face_preprocessed.shape)

            # Generate embedding using your custom model
            embedding = model.predict(face_preprocessed)[0]  # Assuming the model outputs a 1D embedding vector

            # Compare with MongoDB stored embeddings
            from pymongo import MongoClient
            client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB URI
            db = client['face_recognition']  # Your database name
            collection = db['face_data']  # Your collection name

            # Fetch all stored embeddings from MongoDB
            stored_faces = list(collection.find({}, {"_id": 0, "name": 1, "embedding": 1}))

            # Calculate similarity (e.g., Euclidean distance)
            identified_name = None
            min_distance = float('inf')
            threshold = 0.5  # Adjust threshold based on model accuracy

            for stored_face in stored_faces:
                stored_embedding = np.array(stored_face["embedding"])
                distance = np.linalg.norm(embedding - stored_embedding)
                if distance < min_distance:
                    min_distance = distance
                    identified_name = stored_face["name"]

            # Determine if the person is identified
            if min_distance < threshold:
                results.append({"name": identified_name})
            else:
                results.append({"name": None})  # Unknown person

        return jsonify({"faces": results}), 200

    except Exception as e:
        print("Error during verification:", str(e))  # Log the error
        return jsonify({"error": "An error occurred during face verification", "details": str(e)}), 500
