from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import traceback
import random  # Added for generating dynamic prefix variety
from transformers import pipeline

app = Flask(__name__)
CORS(app)

print("\n⏳ Model is loading from Hugging Face... (First time might take a few minutes)")
try:
    # Loading the actual model
    captioner = pipeline("image-to-text", model="Warda-yousaf/my-gif-captioner")
    print("🚀 Model Successfully Loaded and Ready!\n")
except Exception as e:
    print(f"❌ Error occurred while loading the model: {e}")

@app.route('/predict', methods=['POST'])
def predict_caption():
    print("\n📥 [STEP 1]: Request received from React frontend!")
    if 'image' not in request.files:
        print("❌ Error: Image not found in the request.")
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    print(f"📁 File Name: {file.filename}")
    
    try:
        print("📸 [STEP 2]: Extracting the first frame of the GIF...")
        image = Image.open(file)
        image.seek(0)
        image = image.convert('RGB')
        
        print("⚙️ CPU Speed Booster: Resizing image to reduce CPU load...")
        image.thumbnail((384, 384)) 
        
        print("🧠 [STEP 3]: Sending image to the actual AI Model... (Processing started)")
        result = captioner(image)
        print(f"🤖 Model Raw Output: {result}")
        
        caption = result[0]['generated_text']
        
        # Unwanted words clean up
        caption = caption.replace("meme poster", "")
        caption = caption.replace("  ", " ") 
        caption = caption.strip()
        
        # ✂️ Prefix Stripping: Strip any existing repetitive starter words from the AI output
        caption_lower = caption.lower()
        prefixes_to_strip = ["me when ", "me when", "when ", "when", "pov ", "pov:", "a meme of "]
        
        for p in prefixes_to_strip:
            if caption_lower.startswith(p):
                caption = caption[len(p):].strip()
                break
                
        if not caption:
            caption = "something unexpected happens"
            
        # Format the first character to lowercase so it fits naturally inside templates
        core_text = caption[0].lower() + caption[1:] if len(caption) > 1 else caption.lower()
        
        # 🎭 Random Prefix Pool Assignment
        prefix_styles = [
            f"POV: {core_text.capitalize()}",
            f"Me when {core_text}",
            f"That moment when {core_text}",
            f"When you finally {core_text}",
            f"Nobody:\nMe: {core_text.capitalize()}",
            f"How it feels when {core_text}"
        ]
        
        final_caption = random.choice(prefix_styles)
            
        print(f"📤 [STEP 4]: Caption successfully sent to React: '{final_caption}'")
        return jsonify({"caption": final_caption})
        
    except Exception as e:
        print("\n--- 🚨 ACTUAL PYTHON ERROR 🚨 ---")
        traceback.print_exc()
        return jsonify({'error': f"Backend Error: {str(e)}"}), 500

if __name__ == '__main__':
    # Debug mode enabled and running on port 5001
    app.run(debug=True, port=5001)