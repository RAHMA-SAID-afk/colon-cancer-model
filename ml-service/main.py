from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import load_and_preprocess
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)
CORS(app)  # ✅ Allow frontend (localhost:3000) to access this API

# Load trained model
model = load_model("model_resnet50.h5")
CLASS_NAMES = [ "Abnormal", "Normal"]
CONFIDENCE_THRESHOLD = 0.85  # Reject anything lower than this

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    os.makedirs("temp", exist_ok=True)
    image_path = os.path.join("temp", image.filename)
    image.save(image_path)

    try:
        # Step 1: Load and preprocess image
        img = load_and_preprocess(image_path)

        # Step 2: Run prediction
        prediction = model.predict(img)[0]
        predicted_index = prediction.argmax()
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(prediction[predicted_index])

        # Step 3: Reject low-confidence predictions
        if confidence < CONFIDENCE_THRESHOLD:
            return jsonify({
                "error": "This image is not applicable (low confidence).",
                "result": "Unknown",
                "confidence": confidence
            }), 400

        # Step 4: Return valid result
        return jsonify({
            "result": predicted_class,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temp image file
        if os.path.exists(image_path):
            os.remove(image_path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
