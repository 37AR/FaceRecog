from flask import Flask, request, jsonify
from keras.models import load_model  # type: ignore # Corrected import for loading a custom model
import numpy as np
import base64
import io
from PIL import Image
import cv2
from flask_cors import CORS  # Correct import for CORS

app = Flask(__name__)  # Corrected to __name__
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Allow CORS from localhost:3000


# Load your custom model
model = load_model('face_recognition_model.keras')

# Define any preprocessing steps required by your model (resizing, normalization, etc.)
def preprocess_face(face):
    face = cv2.resize(face, (96, 96))  # Resize to the model's expected input size
    face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    face = face.astype("float32") / 255.0  # Normalize to [0, 1]
    face = np.expand_dims(face, axis=-1)  # Add channel dimension (96, 96, 1)
    face = np.expand_dims(face, axis=0)  # Add batch dimension (1, 96, 96, 1)
    return face




@app.route('/api/face/generate-embeddings', methods=['POST'])
def generate_embedding():
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
            # No face detected
            return jsonify({"faceDetected": False, "message": "No face detected"}), 200

        # Process the first detected face (adjust if you want to handle multiple faces)
        (x, y, w, h) = faces[0]
        face = frame[y:y+h, x:x+w]
        
        # Preprocess the face for your custom model
        face_preprocessed = preprocess_face(face)
        print("Preprocessed face shape:", face_preprocessed.shape)
        

        # Generate embedding using your custom model
        embedding = model.predict(face_preprocessed)[0]  # Assuming the model outputs a 1D embedding vector

        # Return embedding
        return jsonify({"faceDetected": True, "faceEncoding": embedding.tolist()}), 200

    except Exception as e:
        print("Error during embedding generation:", str(e))  # Log the error
        return jsonify({"error": "An error occurred while processing the frame", "details": str(e)}), 500


if __name__ == '__main__':  # Corrected __name__ check
    app.run(port=5001)
