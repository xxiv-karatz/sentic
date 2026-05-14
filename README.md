# Sentic – AI-Powered Sentiment Analysis

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sentic.onrender.com/) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Analyse customer feedback, reviews, or any short text. Get per-entry sentiment scores, theme extraction, and AI-generated insights — in a clean, no-framework interface.

**[Live demo →](https://sentic.onrender.com/)**

---

## Features

- **Per-entry analysis** — sentiment label, score (–1 to 1), confidence, emotions, and key phrases
- **Overall metrics** — dominant sentiment, average score, distribution chart
- **Theme extraction** — recurring topics ranked by mentions
- **Insights & recommendations** — executive summary and actionable next steps
- **6 sample datasets** — e-commerce, software, hotel, employee survey, social media, and a default mix
- **No build step** — vanilla HTML/CSS/JS on a Python/Flask backend

---

## Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.10+, Flask |
| Frontend | HTML5, CSS3, Vanilla JS |
| AI | DeepSeek API (`deepseek-chat`) |
| Hosting | Render (free tier) |

---

## Local Setup

```bash
git clone https://github.com/xxiv-karatz/sentic.git
cd sentic
pip install -r requirements.txt
```

Create a `.env` file:
```
DEEPSEEK_API_KEY=your_key_here
```
> Get a key at [platform.deepseek.com](https://platform.deepseek.com/).

```bash
python server.py
# → http://localhost:5000
```

---

## Deploy to Render

1. Push to GitHub, then create a **New Web Service** at [render.com](https://render.com).
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python server.py`
4. Add environment variable: `DEEPSEEK_API_KEY` = your key.

> **Note:** The free tier sleeps after 15 min of inactivity. First request on wake-up may take 30–50 s. Use [UptimeRobot](https://uptimerobot.com/) to keep it alive.

---

## API

**`POST /api/analyze`**

```json
// Request
{ "texts": ["I love the dashboard!", "Support was slow."] }

// Response shape
{
  "items":           [...],  // per-entry sentiment, score, emotions, key phrases
  "overall":         {...},  // averageScore, dominantSentiment, summary
  "themes":          [...],  // label, sentiment, mentions
  "insights":        [...],  // up to 6 strings
  "recommendations": [...]   // up to 5 strings
}
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `No module named 'dotenv'` | Run `pip install -r requirements.txt` |
| `TemplateNotFound` | Keep `index.html` in the same directory as `server.py` |
| API key not working | Check the variable is named exactly `DEEPSEEK_API_KEY` |

---

MIT License
