from flask import Flask, jsonify, request
from machine_lang import translate_text

app = Flask(__name__)

@app.route("/translate", methods=["GET"])
def translate_content():
    from_lang = request.args.get("from")
    to_lang = request.args.get("to")
    content = request.args.get("content")

    if not from_lang or not to_lang or not content:
        return jsonify({"success": "false", "error": "Missing required parameters"}), 400
    
    translated_text = translate_text(content, from_lang, to_lang)
    
    return jsonify({
        "success": "true",
        "translated": translated_text
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)