from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# simple demo AI function (NO TORCH)
def generate_caption(prompt):
    return f"😂 AI Joke: When {prompt}, things get hilarious!"

@app.route("/api/gif-joke", methods=["POST"])
def gif_joke():
    prompt = request.form.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    joke = generate_caption(prompt)

    return jsonify({
        "joke": joke
    })

if __name__ == "__main__":
    app.run(debug=True)