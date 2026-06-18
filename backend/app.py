from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import traceback
from transformers import pipeline

app = Flask(__name__)

# CORS FIX (important for React)
CORS(app, resources={r"/*": {"origins": "*"}})

print("\n⏳ Model is loading......")

# Load model
captioner = pipeline(
    "image-text-to-text",
    model="Warda-yousaf/my-gif-captioner"
)

print("🚀 Model Successfully Loaded!\n")


# ---------------- HOME ROUTE ----------------
@app.route('/')
def home():
    return "Backend Working"


# ---------------- PREDICT ROUTE ----------------
@app.route('/predict', methods=['POST'])
def predict_caption():

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']

    try:
        # Open image
        image = Image.open(file).convert('RGB')

        # Generate caption
        result = captioner(image)
        caption = result[0]['generated_text']

        # Clean text
        caption = caption.replace("meme poster", "")
        caption = caption.strip()

        return jsonify({"caption": caption})

    except Exception as e:
        print("\n--- ERROR ---")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ---------------- RUN SERVER ----------------
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False)