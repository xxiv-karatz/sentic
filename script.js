
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

// ========== DOM refs ==========
const $ = (sel) => document.querySelector(sel);

const input        = $("#input");
const counter      = $("#counter");
const runBtn       = $("#run");
const results      = $("#results");
const toastEl      = $("#toast");
const sampleSelect = $("#sampleSelect");
const themeToggle  = $("#themeToggle");

// ========== Theme toggle ==========
const savedTheme = localStorage.getItem("sentic-theme") || "light";
document.documentElement.dataset.theme = savedTheme;

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("sentic-theme", next);
  themeToggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
});

// ========== Init ==========
input.value = SAMPLES.default;
updateCounter();

sampleSelect.addEventListener("change", () => {
  const key = sampleSelect.value;
  if (SAMPLES[key]) {
    input.value = SAMPLES[key];
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

// ========== Toast ==========
let toastTimer;
function toast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.classList.toggle("error", isError);
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.hidden = true), 4500);
}

// ========== Colors ==========
const SENT_COLOR = {
  positive: "var(--positive)",
  neutral:  "var(--neutral)",
  negative: "var(--negative)",
};

// ========== Analyze ==========
async function analyze() {
  const texts = input.value.split("\n").map((t) => t.trim()).filter(Boolean);
  if (!texts.length) return toast("Add at least one line of text.", true);
  if (texts.length > 50) return toast("Max 50 lines per analysis.", true);

  runBtn.disabled = true;
  runBtn.innerHTML = `<span class="spin"></span>Analyzing`;
  results.hidden = true;

  try {
    const res  = await fetch("/api/analyze", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ texts }),
    });
    const data = await res.json();
    if (!res.ok) { toast(data.error || `Request failed (${res.status})`, true); return; }
    render(data);
  } catch (e) {
    toast("Network error: " + e.message, true);
  } finally {
    runBtn.disabled = false;
    runBtn.innerHTML = "Run analysis →";
  }
}

// ========== Render ==========
function render(d) {
  results.hidden = false;

  const counts = { positive: 0, neutral: 0, negative: 0 };
  d.items.forEach((i) => (counts[i.sentiment] = (counts[i.sentiment] || 0) + 1));
  const total = d.items.length || 1;

  // KPIs
  const domSent = d.overall.dominantSentiment;
  const mSent   = $("#m-sent");
  mSent.textContent = domSent;
  mSent.style.color = SENT_COLOR[domSent] || "var(--ink)";

  $("#m-score").textContent = Number(d.overall.averageScore).toFixed(2);
  $("#m-count").textContent = d.items.length;

  const posRate = Math.round((counts.positive / total) * 100);
  $("#m-posrate").textContent = posRate + "%";
  $("#m-posrate").style.color = SENT_COLOR.positive;

  const avgConf = d.items.reduce((s, i) => s + (i.confidence || 0), 0) / total;
  $("#m-conf").textContent = Math.round(avgConf * 100) + "%";

  // Charts
  renderPie(counts, total);
  renderHistogram(d.items);
  renderConfidenceBars(d.items, counts);
  renderTimeline(d.items);
  renderThemes(d.themes || []);
  renderEmotionCloud(d.items);

  // Report
  $("#summary").textContent = d.overall.summary;
  $("#insights").innerHTML = (d.insights || []).map((s) => `<li>${esc(s)}</li>`).join("");
  $("#recommendations").innerHTML = (d.recommendations || []).map((s) => `<li>${esc(s)}</li>`).join("");

  // Items
  renderItems(d.items);

  // Scroll
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ========== Pie chart ==========
function renderPie(counts, total) {
  const svg    = $("#pie-svg");
  const legend = $("#pie-legend");
  const cx = 110, cy = 110, r = 85, innerR = 48;
  const labels = ["positive", "neutral", "negative"];

  let angle = -Math.PI / 2; // start at top
  const slices = labels.map((k) => {
    const pct   = counts[k] / total;
    const sweep = pct * 2 * Math.PI;
    const slice = { key: k, pct, start: angle, end: angle + sweep, count: counts[k] };
    angle += sweep;
    return slice;
  });

  svg.innerHTML = `<title id="pie-title">Sentiment distribution pie chart</title>`;

  // Draw slices
  slices.forEach((s) => {
    if (s.pct === 0) return;

    // Full circle special case
    if (s.pct === 1) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", getCssVar(s.key));
      circle.setAttribute("opacity", "0.9");
      svg.appendChild(circle);
      return;
    }

    const x1 = cx + r * Math.cos(s.start);
    const y1 = cy + r * Math.sin(s.start);
    const x2 = cx + r * Math.cos(s.end);
    const y2 = cy + r * Math.sin(s.end);
    const xi1 = cx + innerR * Math.cos(s.end);
    const yi1 = cy + innerR * Math.sin(s.end);
    const xi2 = cx + innerR * Math.cos(s.start);
    const yi2 = cy + innerR * Math.sin(s.start);
    const large = s.pct > 0.5 ? 1 : 0;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d",
      `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` +
      ` L ${xi1} ${yi1} A ${innerR} ${innerR} 0 ${large} 0 ${xi2} ${yi2} Z`
    );
    path.setAttribute("fill", getCssVar(s.key));
    path.setAttribute("opacity", "0.9");
    path.setAttribute("role", "img");
    path.setAttribute("aria-label", `${s.key}: ${Math.round(s.pct * 100)}%`);

    // Hover gap effect
    path.style.cursor = "default";
    path.style.transition = "transform 0.2s";
    const midAngle = (s.start + s.end) / 2;
    path.addEventListener("mouseenter", () => {
      path.setAttribute("transform", `translate(${Math.cos(midAngle)*5} ${Math.sin(midAngle)*5})`);
    });
    path.addEventListener("mouseleave", () => path.removeAttribute("transform"));

    svg.appendChild(path);
  });

  // Center label
  const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  centerText.setAttribute("x", cx);
  centerText.setAttribute("y", cy - 8);
  centerText.setAttribute("text-anchor", "middle");
  centerText.setAttribute("font-family", "var(--mono)");
  centerText.setAttribute("font-size", "22");
  centerText.setAttribute("fill", "currentColor");
  centerText.textContent = total;
  svg.appendChild(centerText);

  const centerSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
  centerSub.setAttribute("x", cx);
  centerSub.setAttribute("y", cy + 12);
  centerSub.setAttribute("text-anchor", "middle");
  centerSub.setAttribute("font-size", "10");
  centerSub.setAttribute("fill", "currentColor");
  centerSub.setAttribute("opacity", "0.5");
  centerSub.textContent = "entries";
  svg.appendChild(centerSub);

  // Legend
  legend.innerHTML = labels.map((k) => {
    const pct = Math.round((counts[k] / total) * 100);
    return `
      <span class="pie-legend-item">
        <span class="pie-swatch" style="background:${getCssVar(k)}" aria-hidden="true"></span>
        <span class="pie-label">${k}</span>
        <span class="pie-pct">${pct}%</span>
      </span>`;
  }).join("");
}

// ========== Score histogram ==========
function renderHistogram(items) {
  const svg  = $("#histogram-svg");
  const W = 320, H = 160, padL = 28, padB = 24, padT = 10, padR = 10;
  const bins = 10;
  const bw   = (W - padL - padR) / bins;

  // Bin into [-1, 1]
  const buckets = Array(bins).fill(0);
  items.forEach((item) => {
    const sc  = Math.max(-1, Math.min(1, item.score));
    const idx = Math.min(bins - 1, Math.floor(((sc + 1) / 2) * bins));
    buckets[idx]++;
  });

  const maxB = Math.max(1, ...buckets);

  svg.innerHTML = `<title id="hist-title">Score distribution histogram</title>`;

  // Zero line x-position
  const zeroX = padL + ((0 + 1) / 2) * (W - padL - padR);

  // Zero line
  const zl = document.createElementNS("http://www.w3.org/2000/svg", "line");
  zl.setAttribute("x1", zeroX); zl.setAttribute("y1", padT);
  zl.setAttribute("x2", zeroX); zl.setAttribute("y2", H - padB);
  zl.setAttribute("stroke", "currentColor"); zl.setAttribute("stroke-opacity", "0.15");
  zl.setAttribute("stroke-dasharray", "3 3"); zl.setAttribute("stroke-width", "1");
  svg.appendChild(zl);

  // Bars
  buckets.forEach((count, i) => {
    if (count === 0) return;
    const binCenter = -1 + (i + 0.5) * (2 / bins);
    const color     = binCenter >= 0.2 ? "var(--positive)" : binCenter <= -0.2 ? "var(--negative)" : "var(--neutral)";
    const barH      = ((count / maxB) * (H - padB - padT));
    const x         = padL + i * bw;
    const y         = H - padB - barH;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x",      x + 2);
    rect.setAttribute("y",      y);
    rect.setAttribute("width",  bw - 4);
    rect.setAttribute("height", barH);
    rect.setAttribute("fill",   color);
    rect.setAttribute("rx",     "3");
    rect.setAttribute("opacity","0.85");
    rect.setAttribute("aria-label", `Score range around ${binCenter.toFixed(1)}: ${count} entries`);
    svg.appendChild(rect);
  });

  // X axis labels
  ["-1", "-0.5", "0", "0.5", "1"].forEach((label, i) => {
    const x = padL + (i / 4) * (W - padL - padR);
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x); t.setAttribute("y", H - 6);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "9"); t.setAttribute("fill", "currentColor");
    t.setAttribute("opacity", "0.45"); t.setAttribute("font-family", "var(--mono)");
    t.textContent = label;
    svg.appendChild(t);
  });

  // Y axis: max label
  const yt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yt.setAttribute("x", padL - 4); yt.setAttribute("y", padT + 4);
  yt.setAttribute("text-anchor", "end"); yt.setAttribute("font-size", "9");
  yt.setAttribute("fill", "currentColor"); yt.setAttribute("opacity", "0.45");
  yt.setAttribute("font-family", "var(--mono)");
  yt.textContent = maxB;
  svg.appendChild(yt);
}

// ========== Confidence bars ==========
function renderConfidenceBars(items, counts) {
  const confByLabel = { positive: [], neutral: [], negative: [] };
  items.forEach((i) => { if (confByLabel[i.sentiment]) confByLabel[i.sentiment].push(i.confidence || 0); });

  const avgConf = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const container = $("#conf-bars");
  container.innerHTML = ["positive", "neutral", "negative"].map((k) => {
    const pct = Math.round(avgConf(confByLabel[k]) * 100);
    return `
      <div class="conf-row">
        <span class="conf-label">${k}</span>
        <span class="conf-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${k} average confidence ${pct}%">
          <span class="conf-fill" style="width:${pct}%; background:${getCssVar(k)}"></span>
        </span>
        <span class="conf-pct">${pct}%</span>
      </div>`;
  }).join("");
}

// ========== Timeline sparkline ==========
function renderTimeline(items) {
  const svg  = $("#timeline-svg");
  const W = 900, H = 120, padL = 30, padR = 10, padT = 16, padB = 28;

  svg.innerHTML = `<title id="timeline-title">Sentiment score timeline</title>`;

  const n   = items.length;
  if (n < 2) return;

  const xScale = (i) => padL + (i / (n - 1)) * (W - padL - padR);
  const yScale = (v) => padT + ((1 - (v + 1) / 2)) * (H - padT - padB);

  // Zero line
  const zy = yScale(0);
  const zeroLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  zeroLine.setAttribute("x1", padL); zeroLine.setAttribute("y1", zy);
  zeroLine.setAttribute("x2", W - padR); zeroLine.setAttribute("y2", zy);
  zeroLine.setAttribute("stroke", "currentColor"); zeroLine.setAttribute("stroke-opacity", "0.12");
  zeroLine.setAttribute("stroke-dasharray", "4 4"); zeroLine.setAttribute("stroke-width", "1");
  svg.appendChild(zeroLine);

  // Gradient area fill
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
    </linearGradient>`;
  svg.appendChild(defs);

  // Build path points
  const pts = items.map((item, i) => [xScale(i), yScale(item.score)]);

  // Area path
  const areaD = `M ${pts[0][0]} ${zy} ` +
    pts.map(([x, y]) => `L ${x} ${y}`).join(" ") +
    ` L ${pts[pts.length-1][0]} ${zy} Z`;
  const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
  area.setAttribute("d", areaD);
  area.setAttribute("fill", "url(#tl-grad)");
  svg.appendChild(area);

  // Line path
  const lineD = "M " + pts.map(([x, y]) => `${x} ${y}`).join(" L ");
  const line  = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("d", lineD);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "var(--accent)");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("stroke-linejoin", "round");
  line.setAttribute("stroke-linecap", "round");
  svg.appendChild(line);

  // Dots
  items.forEach((item, i) => {
    const [x, y] = pts[i];
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", x); dot.setAttribute("cy", y); dot.setAttribute("r", "4");
    dot.setAttribute("fill", getCssVar(item.sentiment));
    dot.setAttribute("stroke", "var(--card)"); dot.setAttribute("stroke-width", "2");
    dot.setAttribute("aria-label", `Entry ${i + 1}: ${item.sentiment}, score ${item.score.toFixed(2)}`);
    svg.appendChild(dot);
  });

  // Y axis labels
  [[-1, "-1"], [0, "0"], [1, "+1"]].forEach(([v, label]) => {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", padL - 6); t.setAttribute("y", yScale(v) + 4);
    t.setAttribute("text-anchor", "end"); t.setAttribute("font-size", "9");
    t.setAttribute("fill", "currentColor"); t.setAttribute("opacity", "0.4");
    t.setAttribute("font-family", "var(--mono)");
    t.textContent = label;
    svg.appendChild(t);
  });

  // X axis: entry numbers (every ~5)
  const step = Math.max(1, Math.floor(n / 8));
  for (let i = 0; i < n; i += step) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", xScale(i)); t.setAttribute("y", H - 4);
    t.setAttribute("text-anchor", "middle"); t.setAttribute("font-size", "9");
    t.setAttribute("fill", "currentColor"); t.setAttribute("opacity", "0.35");
    t.setAttribute("font-family", "var(--mono)");
    t.textContent = i + 1;
    svg.appendChild(t);
  }
}

// ========== Themes ==========
function renderThemes(themes) {
  const list    = $("#themes");
  const maxMent = Math.max(1, ...themes.map((t) => t.mentions || 0));

  list.innerHTML = themes.map((t, idx) => {
    const pct = ((t.mentions || 0) / maxMent) * 100;
    return `
      <li class="theme-item">
        <div>
          <div class="theme-name">${esc(t.label)}</div>
          <div class="theme-bar-track" role="progressbar" aria-valuenow="${t.mentions || 0}" aria-valuemax="${maxMent}" aria-label="${t.label}: ${t.mentions} mentions">
            <div class="theme-bar-fill" style="width:${pct}%; background:${getCssVar(t.sentiment)}"></div>
          </div>
        </div>
        <span class="theme-count">${t.mentions ?? 0}</span>
      </li>`;
  }).join("");
}

// ========== Emotion cloud ==========
function renderEmotionCloud(items) {
  // Count all emotions
  const freq = {};
  items.forEach((item) => {
    (item.emotions || []).forEach((e) => {
      const key = e.toLowerCase().trim();
      freq[key] = (freq[key] || 0) + 1;
    });
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const max    = sorted[0]?.[1] || 1;

  const cloud = $("#emotion-cloud");
  cloud.innerHTML = sorted.map(([word, count]) => {
    const ratio = count / max;
    const cls   = ratio >= 0.7 ? "emotion-chip--lg" : ratio >= 0.4 ? "emotion-chip--md" : "";
    return `<span class="emotion-chip ${cls}" title="${count} mention${count !== 1 ? 's' : ''}">${esc(word)}</span>`;
  }).join("");
}

// ========== Per-entry items ==========
function renderItems(items) {
  const list = $("#items");

  list.innerHTML = items.map((item, idx) => {
    const arrow = item.sentiment === "positive" ? "↗" : item.sentiment === "negative" ? "↘" : "→";
    const emotions = (item.emotions || []).length
      ? `<div class="tags">${item.emotions.map((e) => `<span class="tag">${esc(e)}</span>`).join("")}</div>`
      : "";
    const phrases = (item.keyPhrases || []).length
      ? `<p class="item-phrases">"${item.keyPhrases.slice(0, 3).map(esc).join(" · ")}"</p>`
      : "";

    return `
      <li class="item-entry" data-sentiment="${item.sentiment}">
        <div>
          <div class="item-head">
            <span class="sentiment-arrow" style="color:${getCssVar(item.sentiment)}" aria-hidden="true">${arrow}</span>
            <span class="pill" style="color:${getCssVar(item.sentiment)}">${item.sentiment}</span>
            <span class="score-badge">${Number(item.score).toFixed(2)} · ${Math.round((item.confidence || 0) * 100)}% conf</span>
          </div>
          <p class="item-text">${esc(item.text)}</p>
        </div>
        <div class="item-meta">${emotions}${phrases}</div>
      </li>`;
  }).join("");

  // Attach filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      document.querySelectorAll(".item-entry").forEach((el) => {
        el.hidden = filter !== "all" && el.dataset.sentiment !== filter;
      });
    });
  });
}

// ========== Helpers ==========
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Reads CSS variable value via a temp element so SVG fill="var(--x)" works everywhere
function getCssVar(sentimentKey) {
  // Return as var() string — works in all modern browsers for SVG fill
  const map = {
    positive: "var(--positive)",
    neutral:  "var(--neutral)",
    negative: "var(--negative)",
  };
  return map[sentimentKey] || "var(--muted)";
}