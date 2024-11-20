# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# import base64
# from pymongo import MongoClient
# from your_model_script import build_cnn_model, IMAGE_SIZE # type: ignore

# app = Flask(__name__)

# # MongoDB setup
# client = MongoClient('mongodb://localhost:27017/')
# db = client['FaceRecog']
# collection = db['face_embeddings']

# # Load CNN Model
# model = build_cnn_model(input_shape=(96, 96, 1), num_classes=100)  # Adjust `num_classes` as required

# @app.route('/register-face', methods=['POST'])
# def register_face():
#     name = request.form.get('name')
#     num_images = int(request.form.get('numImages', 0))
#     images = []

#     # Extract images from form data
#     for i in range(num_images):
#         img_str = request.form.get(f'image_{i}')
#         if img_str:
#             img_data = base64.b64decode(img_str)
#             nparr = np.frombuffer(img_data, np.uint8)
#             img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
#             img = cv2.resize(img, IMAGE_SIZE)
#             images.append(img)

#     if not images:
#         return jsonify({'success': False, 'message': 'No images received'}), 400

#     images = np.array(images).reshape(-1, 96, 96, 1) / 255.0
#     embeddings = model.predict(images)  # Generate embeddings

#     # Save embeddings to MongoDB
#     user_data = {
#         'name': name,
#         'embeddings': embeddings.tolist(),
#     }
#     collection.insert_one(user_data)

#     return jsonify({'success': True, 'message': f'{name} registered successfully'})

# if __name__ == '__main__':
#     app.run(debug=True)



from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from pymongo import MongoClient
from your_model_script import build_cnn_model, IMAGE_SIZE  # Import your CNN model logic

app = Flask(__name__)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['FaceRecog']
collection = db['face_embeddings']

# Load or initialize the CNN Model
model = build_cnn_model(input_shape=(96, 96, 1), num_classes=100)  # Adjust `num_classes` as needed
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])  # Compile the model

@app.route('/register-face', methods=['POST'])
def register_face():
    try:
        # Extract form data
        name = request.form.get('name')
        num_images = int(request.form.get('numImages', 0))
        images = []

        # Extract images from form data
        for i in range(num_images):
            img_str = request.form.get(f'image_{i}')
            if img_str:
                img_data = base64.b64decode(img_str)
                nparr = np.frombuffer(img_data, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
                img = cv2.resize(img, IMAGE_SIZE)
                images.append(img)

        if not images:
            return jsonify({'success': False, 'message': 'No images received'}), 400

        # Preprocess images
        images = np.array(images).reshape(-1, 96, 96, 1) / 255.0

        # Generate embeddings using the model
        embeddings = model.predict(images)
        print("Generated embeddings shape:", embeddings.shape)

        # Prepare labels for training (One-Hot Encoding for example)
        labels = np.array([[1 if name == f"class_{i}" else 0 for i in range(100)] for _ in range(len(images))])

        # Train the model
        model.fit(images, labels, epochs=5, batch_size=8)  # Adjust epochs and batch_size as required
        print("Model trained successfully with the new embeddings.")

        # Save embeddings and label to MongoDB
        user_data = {
            'name': name,
            'embeddings': embeddings.tolist(),
        }
        collection.insert_one(user_data)

        return jsonify({'success': True, 'message': f'{name} registered successfully and model retrained'})
    except Exception as e:
        print("Error during face registration:", str(e))
        return jsonify({'success': False, 'message': 'An error occurred during registration'}), 500

if __name__ == '__main__':
    app.run(debug=True)

