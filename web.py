from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
import random

app = Flask(__name__)
CORS(app)

# ✅ YOUR MODEL
MODEL_NAME = "rafiaislam/gif-prompt-model"

processor = BlipProcessor.from_pretrained(MODEL_NAME)
model = BlipForConditionalGeneration.from_pretrained(MODEL_NAME)

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Funny emoji list
emojis = ["😂", "🤣", "😹", "🔥", "💀"]

@app.route("/api/gif-joke", methods=["POST"])
def generate_joke():
    try:
        prompt = request.form.get("prompt", "")

        if "gif" not in request.files:
            return jsonify({"error": "No GIF uploaded"})

        file = request.files["gif"]

        # Open GIF (first frame)
        image = Image.open(file.stream).convert("RGB")

        # BLIP caption
        inputs = processor(image, return_tensors="pt").to(device)

        output = model.generate(
            **inputs,
            max_new_tokens=20,   # short output
            do_sample=True,
            temperature=0.8,
            top_p=0.9
        )

        caption = processor.decode(output[0], skip_special_tokens=True)

        # ✅ CLEAN repetition
        caption = " ".join(dict.fromkeys(caption.split()))

        # ✅ FINAL FUNNY FORMAT
        joke = f"{prompt}  {caption} {random.choice(emojis)}"

        return jsonify({"joke": joke})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)