// Sentic — vanilla JS frontend with 6 sample datasets (auto-load on select)

// ========== SAMPLE DATASETS ==========
const SAMPLES = {
  default: `The new dashboard is incredibly fast and the dark mode looks beautiful.
Support took three days to respond. Not great.
It works fine, nothing special but nothing broken either.
Absolutely love the new export feature — saved me hours this week!
The mobile app keeps crashing when I open the analytics tab.
Pricing went up again. I'm starting to look at competitors.
Onboarding was smooth and the docs are excellent.`,

  ecommerce: `The shipping was super fast, arrived in 2 days!
The item broke after one use. Cheap quality.
It's okay for the price, nothing special.
Customer service refunded me immediately. Great experience!
The sizing chart is completely wrong.
Love the color and design, exactly as pictured.
No instructions included, had to guess how to assemble.
Decent product but overpriced for what it is.
The return process was simple and hassle-free.
Packaging was excessive and not eco-friendly.
The product exceeded my expectations for this price point.
Delivery took three weeks longer than promised.
The material feels premium and durable.
Would not buy again, the zipper broke on day one.`,

  software: `The UI is intuitive and onboarding took less than 5 minutes.
The mobile app crashes every time I try to upload a photo.
Works fine on desktop but the mobile experience needs work.
Their API is well documented and easy to integrate.
Support tickets take 48 hours to get a first response. Too slow.
The new update broke my existing workflows.
Analytics dashboard is powerful but a bit overwhelming.
Good value compared to competitors.
The search feature is lightning fast.
Exporting data to CSV often fails with large files.
I love the dark mode and keyboard shortcuts.
The pricing page is confusing about what's included.
Customer support solved my issue within 2 hours.
The software lacks basic reporting features.
Very happy with the regular feature updates.`,

  hotel: `The room was spotless and the bed was very comfortable.
Reception staff were rude and unhelpful.
Breakfast buffet had many options, all fresh.
The pool was closed for renovation without prior notice.
Great location, walking distance to all major sights.
Walls are thin, could hear neighbours talking all night.
Check-in was quick and they gave us a free room upgrade.
Overpriced for the amenities offered.
The view from the balcony was breathtaking.
Housekeeping forgot to refill toiletries twice.
Free Wi-Fi was fast and reliable.
The air conditioning was broken in July.
Loved the complimentary welcome drinks.`,

  employee: `I feel valued and my manager supports my growth.
Work-life balance is non-existent here.
The office snacks and coffee are a nice perk.
Salaries are below market rate and raises are rare.
Collaboration tools are modern and well maintained.
Too many unnecessary meetings every week.
Health insurance coverage is excellent.
Promotions are given unfairly, not based on merit.
The company culture is inclusive and welcoming.
Remote work policy is flexible and well implemented.
Annual team offsite was actually fun and productive.
I'm actively looking for other opportunities.`,

  social: `Omg this new feature is a game changer! 🔥
Why is your app asking for location permission every time? 🤔
Best purchase I've made all year. Highly recommend.
Customer support ghosted me after I complained about a defect.
Meh, it's fine but I've seen better alternatives.
The tutorial was actually helpful and funny.
Does anyone else have trouble logging in on Android?
Love the brand values and sustainability efforts.
The latest update ruined the battery life.
This is exactly what I've been waiting for, thank you!
Never buying from this brand again.
Your team replied to my DM in minutes, impressive.
The checkout process is way too complicated.
Been a loyal customer for 5 years, still great quality.
Fix your notification spam, it's driving me crazy.`
};

const $ = (sel) => document.querySelector(sel);

const input = $("#input");
const counter = $("#counter");
const runBtn = $("#run");
const results = $("#results");
const toastEl = $("#toast");
const sampleSelect = $("#sampleSelect");

// Load default sample on page load
input.value = SAMPLES.default;
updateCounter();

// When dropdown selection changes, load the chosen sample
sampleSelect.addEventListener("change", () => {
  const selected = sampleSelect.value;
  const sampleText = SAMPLES[selected];
  if (sampleText) {
    input.value = sampleText;
    updateCounter();
    toast(`Loaded ${sampleSelect.options[sampleSelect.selectedIndex].text}`, false);
  }
});

input.addEventListener("input", updateCounter);
runBtn.addEventListener("click", analyze);

function updateCounter() {
  const n = input.value.split("\n").filter((l) => l.trim()).length;
  counter.textContent = `${n} ${n === 1 ? "entry" : "entries"}`;
}

let toastTimer;
function toast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.classList.toggle("error", isError);
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.hidden = true), 4500);
}

const SENT_COLOR = {
  positive: "var(--positive)",
  neutral: "var(--neutral)",
  negative: "var(--negative)",
};

async function analyze() {
  const texts = input.value.split("\n").map((t) => t.trim()).filter(Boolean);
  if (!texts.length) return toast("Add at least one line of text.", true);
  if (texts.length > 50) return toast("Max 50 lines per analysis.", true);

  runBtn.disabled = true;
  runBtn.innerHTML = `<span class="spin"></span>Analyzing`;
  results.hidden = true;

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || `Request failed (${res.status})`, true);
      return;
    }
    render(data);
  } catch (e) {
    toast("Network error: " + e.message, true);
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = "Run analysis →";
  }
}

function render(d) {
  results.hidden = false;

  $("#m-sent").textContent = d.overall.dominantSentiment;
  $("#m-sent").style.color = SENT_COLOR[d.overall.dominantSentiment] || "var(--ink)";
  $("#m-score").textContent = Number(d.overall.averageScore).toFixed(2);
  $("#m-count").textContent = d.items.length;
  $("#summary").textContent = d.overall.summary;

  // Distribution
  const counts = { positive: 0, neutral: 0, negative: 0 };
  d.items.forEach((i) => (counts[i.sentiment] = (counts[i.sentiment] || 0) + 1));
  const total = d.items.length || 1;
  $("#dist").innerHTML = ["positive", "neutral", "negative"]
    .map((k) => {
      const pct = (counts[k] / total) * 100;
      return `
        <div class="dist-row">
          <div class="dist-label">${k}</div>
          <div class="dist-bar"><span style="width:${pct}%; background:${SENT_COLOR[k]}"></span></div>
          <div class="theme-count">${counts[k]}</div>
        </div>`;
    })
    .join("");

  // Themes
  const maxMentions = Math.max(1, ...d.themes.map((t) => t.mentions || 0));
  $("#themes").innerHTML = (d.themes || [])
    .map((t) => {
      const pct = ((t.mentions || 0) / maxMentions) * 100;
      return `
        <div class="theme-row">
          <div>
            <div>${escapeHtml(t.label)}</div>
            <div class="theme-bar"><span style="width:${pct}%; background:${SENT_COLOR[t.sentiment]}"></span></div>
          </div>
          <div class="theme-count">${t.mentions ?? 0}</div>
        </div>`;
    })
    .join("");

  $("#insights").innerHTML = (d.insights || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  $("#recommendations").innerHTML = (d.recommendations || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");

  $("#items").innerHTML = d.items
    .map((i) => {
      const arrow = i.sentiment === "positive" ? "↗" : i.sentiment === "negative" ? "↘" : "→";
      return `
        <div class="item">
          <div>
            <div class="item-head">
              <span style="color:${SENT_COLOR[i.sentiment]}">${arrow}</span>
              <span class="pill" style="color:${SENT_COLOR[i.sentiment]}">${i.sentiment}</span>
              <span class="score">${Number(i.score).toFixed(2)} · ${Math.round((i.confidence || 0) * 100)}% conf</span>
            </div>
            <p class="item-text">${escapeHtml(i.text)}</p>
          </div>
          <div>
            ${
              (i.emotions || []).length
                ? `<div class="tags">${i.emotions.map((e) => `<span class="tag">${escapeHtml(e)}</span>`).join("")}</div>`
                : ""
            }
            ${
              (i.keyPhrases || []).length
                ? `<div class="phrases">"${i.keyPhrases.slice(0, 3).map(escapeHtml).join(" · ")}"</div>`
                : ""
            }
          </div>
        </div>`;
    })
    .join("");

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}