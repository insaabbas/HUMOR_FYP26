from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import traceback

# Nayi library (Local inference ke liye)
from transformers import pipeline

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

print("\n⏳ Model is loading......)")
# 🔥 Load model
print("\n⏳ Model is loading......")

captioner = pipeline(
    "image-text-to-text",
    model="Warda-yousaf/my-gif-captioner"
)

print("🚀 Model Successfully Loaded!\n")
@app.route('/predict', methods=['POST'])
def predict_caption():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    
    try:
        # 1. Image open
        image = Image.open(file)
        image.seek(0)
        image = image.convert('RGB')
        
        # 2. 🔥 Direct caption generate 
        result = captioner(image)
        caption = result[0]['generated_text']
        
        # 3. Clean up unwanted words
        caption = caption.replace("meme poster", "")
        caption = caption.replace("  ", " ") 
        caption = caption.strip()
            
        return jsonify({"caption": caption})
        
    except Exception as e:
        print("\n--- 🚨 ACTUAL PYTHON ERROR 🚨 ---")
        traceback.print_exc()
        return jsonify({'error': f"Backend Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False)