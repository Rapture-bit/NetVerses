from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/translate")
def translate_content():
    return jsonify(
        {"success": "true", "response": "Success"}
    )