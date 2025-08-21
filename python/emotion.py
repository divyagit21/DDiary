from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app,supports_credentials=True, origins=["http://localhost:3000"]) 

emotion_classifier = pipeline("text-classification", model="ayoubkirouane/BERT-Emotions-Classifier", return_all_scores=True)


@app.route('/api/ai/analyze', methods=['POST'])
def analyze_emotion():
    try:
        data = request.get_json()
        input_text = data.get("text", "").strip()

        if not input_text:
            return jsonify({"error": "No text provided"}), 400

        results = emotion_classifier(input_text)

        sorted_results = sorted(results[0], key=lambda x: x['score'], reverse=True)
        top_emotion = sorted_results[0]

        return jsonify({
            "emotion": top_emotion["label"],
            "confidence": round(top_emotion["score"], 4),
            "all_scores": sorted_results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)


