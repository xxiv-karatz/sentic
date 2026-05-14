"""
Sentic — Sentiment Analysis with DeepSeek API
Flask backend that serves everything from the current folder.
"""

import json
import os
import re
import sys

import requests
from flask import Flask, jsonify, request, send_from_directory

DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
DEFAULT_MODEL = "deepseek-chat"
MAX_TEXTS = 50
MAX_TEXT_LEN = 5000

SYSTEM_PROMPT = """You are an expert sentiment analyst. Analyze the provided texts
(reviews, feedback, social posts, transcripts). Score sentiment from -1 (very
negative) to 1 (very positive). Identify recurring themes, surface actionable
insights, and provide concrete recommendations.

Respond ONLY with a single JSON object — no markdown, no prose, no code fences —
matching this exact shape:

{
  "items": [
    {
      "text": "<verbatim original text>",
      "sentiment": "positive" | "neutral" | "negative",
      "score": <number between -1 and 1>,
      "confidence": <number between 0 and 1>,
      "emotions": [<up to 5 short emotion words>],
      "keyPhrases": [<up to 5 short phrases from the text>]
    }
  ],
  "overall": {
    "averageScore": <number between -1 and 1>,
    "dominantSentiment": "positive" | "neutral" | "negative",
    "summary": "<one or two sentence executive summary>"
  },
  "themes": [
    { "label": "<short theme>", "sentiment": "positive"|"neutral"|"negative", "mentions": <integer> }
  ],
  "insights": [<up to 6 short insight strings>],
  "recommendations": [<up to 5 short recommendation strings>]
}
"""

app = Flask(__name__, static_folder=None)  # disable default static folder

def extract_json(raw: str) -> dict:
    cleaned = re.sub(r"```json\s*", "", raw, flags=re.IGNORECASE)
    cleaned = cleaned.replace("```", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found")
    return json.loads(cleaned[start:end+1])

def call_deepseek(api_key: str, texts: list[str]) -> dict:
    user_prompt = "Analyze these texts. Use the verbatim original text in items[].text.\n\n"
    user_prompt += "\n\n".join(f"Text {i+1}: {t}" for i, t in enumerate(texts))

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": DEFAULT_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
    }
    resp = requests.post(DEEPSEEK_URL, headers=headers, json=payload, timeout=60)
    if resp.status_code == 401:
        raise RuntimeError("Invalid DeepSeek API key.")
    if resp.status_code == 429:
        raise RuntimeError("Rate limit exceeded. Please wait and try again.")
    if not resp.ok:
        raise RuntimeError(f"DeepSeek API error {resp.status_code}: {resp.text[:200]}")
    data = resp.json()
    content = data["choices"][0]["message"]["content"]
    return extract_json(content)

# Serve index.html from root
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

# Serve static files (CSS, JS) from root
@app.route("/<path:filename>")
def static_files(filename):
    if filename.endswith((".css", ".js")):
        return send_from_directory(".", filename)
    return "Not found", 404

@app.route("/api/analyze", methods=["POST"])
def analyze():
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        return jsonify({"error": "Server missing DEEPSEEK_API_KEY"}), 500

    body = request.get_json(silent=True) or {}
    texts = body.get("texts")
    if not isinstance(texts, list) or not texts:
        return jsonify({"error": "Provide a non-empty 'texts' array."}), 400
    if len(texts) > MAX_TEXTS:
        return jsonify({"error": f"Max {MAX_TEXTS} texts per request."}), 400

    cleaned = []
    for t in texts:
        if not isinstance(t, str):
            return jsonify({"error": "All texts must be strings."}), 400
        t = t.strip()
        if not t:
            continue
        if len(t) > MAX_TEXT_LEN:
            return jsonify({"error": f"Each text must be <= {MAX_TEXT_LEN} chars."}), 400
        cleaned.append(t)

    if not cleaned:
        return jsonify({"error": "No non-empty texts provided."}), 400

    try:
        result = call_deepseek(api_key, cleaned)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502
    except (ValueError, KeyError, json.JSONDecodeError) as e:
        return jsonify({"error": f"Could not parse model response: {e}"}), 502
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500

    return jsonify(result)

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    if not os.environ.get("DEEPSEEK_API_KEY"):
        print("WARNING: DEEPSEEK_API_KEY is not set.", file=sys.stderr)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)