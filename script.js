/* =========================================================
   Sentic — script.js
   Improved: better histogram, confidence chart, momentum
   chart, and 25-entry realistic sample datasets.
   ========================================================= */

// ========== Sample Datasets (25 entries each) ==========
const SAMPLES = {
  // Neutral mix (slightly positive leaning but overall neutral)
  default: `The new dashboard is incredibly fast and the dark mode looks beautiful.
Support took three days to respond — not great at all.
It works fine, nothing special but nothing broken either.
Absolutely love the new export feature — saved me hours this week!
The mobile app keeps crashing when I open the analytics tab.
Pricing went up again. I'm starting to look at competitors.
Onboarding was smooth and the documentation is excellent.
The UI feels cluttered on smaller screens but overall it's fine.
Finally got a response from support after four days. Way too slow.
This product changed how my whole team works. Genuinely impressive.
The API rate limits are way too restrictive for our use case.
Pretty average overall — does the job but nothing stands out.
The notifications are spammy and there's no way to batch them.
Best tool in its category by a wide margin. Wouldn't switch for anything.
The latest changelog shows a lot of care went into this release.
I've been a customer for two years and quality has only improved.
The search is borderline useless when you have a large dataset.
Setup took under ten minutes, which is a record for this type of software.
There are some rough edges but the core experience is solid.
Customer support solved a tricky issue within the hour. Impressed.
The free tier is too limited to get any real feel for the product.
Dark mode is perfect, wish I could customise the accent colours too.
Pages feel sluggish after the last update — something regressed.
Honestly the best onboarding flow I've seen in years.
Works as advertised. No complaints, no praise. Just works.`,

  // HEAVILY NEGATIVE (e-commerce complaints)
  ecommerce: `The item broke after a single use. Genuinely terrible build quality.
Worst purchase I've made this year. Completely fell apart.
Customer service never replied to any of my emails. Zero support.
The sizing chart is completely wrong — I ordered the right size and it was tiny.
No assembly instructions included at all — had to find a YouTube video.
Delivery took three weeks longer than the stated estimate.
The material feels cheap and it smells strange out of the box.
Zipper broke on the first day. Would not buy from this brand again.
Product looks nothing like the listing photos. Very misleading.
The discount code at checkout didn't work and support never replied.
Cheap plastic, overpriced, and arrived scratched.
Return shipping cost more than the product itself. Absurd.
The "premium" version is exactly the same as the standard one.
Customer support hung up on me twice. Unacceptable.
The product arrived used with someone else's hair on it.
Battery lasted less than two hours when advertised for ten.
Missing half the screws and hardware in the box.
The app required to use this is full of ads and spyware.
Subscription auto-renewed without any warning email.
The refund process took six weeks and multiple chases.
Quality control is non-existent — every unit has different defects.
The seller sent a completely different color than ordered.
Warranty claim was denied for a made-up reason.
This is the third defective unit in a row. I'm done.
Never buying from this brand again after what happened last month.`,

  // HEAVILY POSITIVE (software)
  software: `The UI is intuitive and onboarding took less than five minutes. Best ever.
Their API is well documented and genuinely easy to integrate.
Support tickets are answered within the hour — absolutely fantastic.
The latest update added all the features we requested. Great team.
Analytics dashboard is powerful yet easy to use for beginners.
Best value compared to every competitor I've evaluated. Hands down.
The search feature is noticeably fast even with a large dataset.
Exporting to CSV works flawlessly even with hundreds of thousands rows.
I love the dark mode and the keyboard shortcuts — very thoughtful.
The pricing page is transparent and fairly tiered.
Customer support solved a complex issue within two hours. Excellent.
The software ships new features every two weeks — very responsive team.
Offline mode works perfectly and syncs seamlessly when back online.
Onboarding flow is the best I've seen in this category. Genuinely.
Integration with our existing tools was painless and fast.
Billing support was helpful and resolved a double-charge quickly.
The product roadmap is exciting — they listen to community feedback.
Mobile app is just as good as the desktop version. Rare.
Custom dashboards are a game changer for our reporting workflow.
The new real-time collaboration feature is brilliantly implemented.
Exactly what our team needed. Renewed for another year without question.
Live chat support is available 24/7 and always helpful.
The free tier is generous enough to fully evaluate the product.
Every update makes the product faster and more reliable.
I've recommended this to five colleagues and all love it.`,

  // HEAVILY NEGATIVE (hotel stay)
  hotel: `The room was dirty and the bed had stains on the sheets. Disgusting.
Reception staff were rude and dismissive from the moment we arrived.
The pool was closed for renovation with absolutely no prior notice.
Walls are paper thin. We could hear the neighbours talking all night.
Overpriced for the standard of amenities on offer.
Housekeeping forgot to replenish toiletries on three separate days.
The air conditioning was completely broken during a heatwave in July.
Room service arrived 90 minutes late and the food was cold.
Bed linen wasn't changed for our entire five-night stay.
Checkout took 45 minutes despite a pre-arranged express option.
Noise from the street made sleeping nearly impossible on busy nights.
Bathroom had mould visible around the grout and tiles.
The "free breakfast" was just stale pastries and watery juice.
The lift was broken for two days — climbed ten floors each time.
Wi-Fi kept disconnecting every few minutes. Useless for work.
The room smelled strongly of cigarette smoke despite non-smoking policy.
The hotel lost our reservation and claimed we never booked.
Parking cost an extra $40 per night with no mention upfront.

The receptionist apologized and gave us a free drink voucher – nice touch.
The rooftop bar has an amazing view and the cocktails were delicious.
Housekeeping came immediately when we asked for extra towels – very responsive.
The bed was actually very comfortable despite the other issues.
The location is perfect – walking distance to all the main sights.
One of the waiters was super helpful and made our dinner great.
Check-in was fast and the bellboy carried our bags with a smile.`,

  // HEAVILY POSITIVE (employee)
  employee: `I feel genuinely valued here and my manager actively supports my growth.
The culture is generally good, but some teams are cliquey.
Salaries are above market rate but raises have been frozen this year.
Our collaboration tools are modern, well-chosen, and well-maintained.
The health insurance is decent but premiums went up again.
Promotions seem to favour people who speak up in meetings, not always merit.
The company culture is inclusive on paper, but execution is inconsistent.
Remote work policy is flexible and implemented thoughtfully.
The annual team offsite was fun, though it ate into a weekend.
Several talented colleagues have left recently due to management issues.
Learning and development budget is generous and easy to access.
Senior leadership are transparent sometimes, but other times out of touch.
The engineering culture values quality, but deadlines often force shortcuts.
Work-life balance is respected by my manager, not by upper leadership.
Onboarding was thorough and made me feel welcome from day one.
The performance review process feels like a box-ticking exercise.
There's real autonomy here — I own my work and that feels great.
We get equity, but the company's valuation has dropped significantly.
The company pretends to care about mental health, but workloads are high.
Recognition happens sometimes, but mostly for the same few people.
Cross-team collaboration is encouraged and actually happens in practice.
I would recommend this company to a friend, but with some reservations.
The CEO tries to know names, but upper management is disconnected.
Four-day work weeks in summer were great — wish it was year-round.
I'm happy enough here, but I keep my eye on other opportunities.`,

  // NEUTRAL (social media)
  social: `Omg this new feature is pretty cool I guess 🔥
Why does your app ask for location permission literally every time? 🤔
Best purchase I've made all year. Highly recommend without hesitation.
Customer support ghosted me completely after I raised a defect.
Meh, it's fine I guess. I've definitely seen better alternatives out there.
The tutorial was actually helpful and had a few genuinely funny moments.
Does anyone else get a login loop on Android 14? Happening to me daily.
Love the brand values and the sustainability commitments — feel real.
The latest update has absolutely killed my battery life. Reverting.
This is exactly what I've been waiting for. Thank you for shipping it!
Never buying from this brand again after what happened last month.
Your team replied to my DM in under ten minutes. Genuinely impressed.
The checkout flow is way too many steps. Lost me at step four.
Been a loyal customer for five years and the quality is still top notch.
Fix your notification spam please — getting 12 alerts a day is insane.
Just switched from a competitor and I'm not looking back. So much better.
The app UI looks gorgeous on the new phone. Really polished work.
Ordered twice, wrong item sent both times. Sorting this out is exhausting.
The community around this product is incredibly supportive and active.
Disappointed by the lack of response to accessibility feedback.
First order was perfect. Second was a disaster. Very inconsistent.
The founders actually responded to my tweet. Rare and appreciated.
Every update seems to introduce new bugs while fixing old ones.
Recommended this to my whole team and everyone loves it.
This is the third time I've had to reset my password this month.`
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
    runBtn.innerHTML = "Run analysis \u2192";
  }
}

// ========== Render ==========
function render(d) {
  results.hidden = false;

  const counts = { positive: 0, neutral: 0, negative: 0 };
  d.items.forEach((i) => { counts[i.sentiment] = (counts[i.sentiment] || 0) + 1; });
  const total = d.items.length || 1;

  // KPIs
  const domSent = d.overall.dominantSentiment;
  const mSent   = $("#m-sent");
  mSent.textContent = domSent;
  mSent.style.color = SENT_COLOR[domSent] || "var(--ink)";

  $("#m-score").textContent  = Number(d.overall.averageScore).toFixed(2);
  $("#m-count").textContent  = d.items.length;

  const posRate = Math.round((counts.positive / total) * 100);
  $("#m-posrate").textContent = posRate + "%";
  $("#m-posrate").style.color = SENT_COLOR.positive;

  const avgConf = d.items.reduce((s, i) => s + (i.confidence || 0), 0) / total;
  $("#m-conf").textContent = Math.round(avgConf * 100) + "%";

  // Charts
  renderPie(counts, total);
  renderHistogram(d.items);
  renderConfidenceChart(d.items, counts);
  renderMomentumChart(d.items);
  renderThemes(d.themes || []);
  renderEmotionCloud(d.items);

  // Report
  $("#summary").textContent = d.overall.summary;
  $("#insights").innerHTML        = (d.insights || []).map((s) => `<li>${esc(s)}</li>`).join("");
  $("#recommendations").innerHTML = (d.recommendations || []).map((s) => `<li>${esc(s)}</li>`).join("");

  renderItems(d.items);
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ========== Pie chart ==========
function renderPie(counts, total) {
  const svg    = $("#pie-svg");
  const legend = $("#pie-legend");
  const cx = 110, cy = 110, r = 85, innerR = 48;
  const labels = ["positive", "neutral", "negative"];

  let angle = -Math.PI / 2;
  const slices = labels.map((k) => {
    const pct   = counts[k] / total;
    const sweep = pct * 2 * Math.PI;
    const slice = { key: k, pct, start: angle, end: angle + sweep, count: counts[k] };
    angle += sweep;
    return slice;
  });

  svg.innerHTML = `<title id="pie-title">Sentiment distribution pie chart</title>`;

  slices.forEach((s) => {
    if (s.pct === 0) return;
    if (s.pct === 1) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);  circle.setAttribute("fill", getCssVar(s.key));
      circle.setAttribute("opacity", "0.9");
      svg.appendChild(circle);
      return;
    }
    const x1 = cx + r * Math.cos(s.start), y1 = cy + r * Math.sin(s.start);
    const x2 = cx + r * Math.cos(s.end),   y2 = cy + r * Math.sin(s.end);
    const xi1 = cx + innerR * Math.cos(s.end),   yi1 = cy + innerR * Math.sin(s.end);
    const xi2 = cx + innerR * Math.cos(s.start), yi2 = cy + innerR * Math.sin(s.start);
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
  centerText.setAttribute("x", cx); centerText.setAttribute("y", cy - 8);
  centerText.setAttribute("text-anchor", "middle");
  centerText.setAttribute("font-family", "var(--mono)");
  centerText.setAttribute("font-size", "22");
  centerText.setAttribute("fill", "currentColor");
  centerText.textContent = total;
  svg.appendChild(centerText);

  const centerSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
  centerSub.setAttribute("x", cx); centerSub.setAttribute("y", cy + 12);
  centerSub.setAttribute("text-anchor", "middle");
  centerSub.setAttribute("font-size", "10");
  centerSub.setAttribute("fill", "currentColor");
  centerSub.setAttribute("opacity", "0.5");
  centerSub.textContent = "entries";
  svg.appendChild(centerSub);

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

// ========== Score Histogram (improved) ==========
// Colour-coded zones, count labels on bars, mean indicator,
// horizontal grid lines, and cleaner axis annotations.
function renderHistogram(items) {
  const svg = $("#histogram-svg");
  const W = 320, H = 220, padL = 32, padB = 30, padT = 14, padR = 12;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("height", H);
  const bins = 10;
  const bw   = (W - padL - padR) / bins;
  const ns   = "http://www.w3.org/2000/svg";

  const buckets = Array(bins).fill(0);
  items.forEach((item) => {
    const sc  = Math.max(-1, Math.min(1, item.score));
    const idx = Math.min(bins - 1, Math.floor(((sc + 1) / 2) * bins));
    buckets[idx]++;
  });

  const maxB   = Math.max(1, ...buckets);
  const meanSc = items.reduce((a, b) => a + b.score, 0) / (items.length || 1);

  svg.innerHTML = `<title id="hist-title">Score distribution histogram</title>`;

  const svgEl = (tag, attrs, text) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const yOf = (count) => H - padB - (count / maxB) * (H - padB - padT);

  // Horizontal grid lines at 25 / 50 / 75 / 100 % of max
  [0.25, 0.5, 0.75, 1].forEach((frac) => {
    const y = H - padB - frac * (H - padB - padT);
    svg.appendChild(svgEl("line", {
      x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: "currentColor", "stroke-opacity": "0.07", "stroke-width": "1",
    }));
    if (frac === 0.5 || frac === 1) {
      svg.appendChild(svgEl("text", {
        x: padL - 4, y: y + 3.5,
        "text-anchor": "end", "font-size": "8",
        fill: "currentColor", opacity: "0.38", "font-family": "var(--mono)",
      }, String(Math.round(maxB * frac))));
    }
  });

  // Zero-score dashed vertical reference
  const zeroX = padL + ((0 + 1) / 2) * (W - padL - padR);
  svg.appendChild(svgEl("line", {
    x1: zeroX, y1: padT - 4, x2: zeroX, y2: H - padB,
    stroke: "currentColor", "stroke-opacity": "0.18",
    "stroke-dasharray": "3 3", "stroke-width": "1",
  }));
  svg.appendChild(svgEl("text", {
    x: zeroX, y: padT - 6,
    "text-anchor": "middle", "font-size": "8",
    fill: "currentColor", opacity: "0.4", "font-family": "var(--mono)",
  }, "0"));

  // Bars
  buckets.forEach((count, i) => {
    if (count === 0) return;
    const binCenter = -1 + (i + 0.5) * (2 / bins);
    const color = binCenter >= 0.15 ? "var(--positive)"
                : binCenter <= -0.15 ? "var(--negative)"
                : "var(--neutral)";
    const barH = (count / maxB) * (H - padB - padT);
    const x    = padL + i * bw;
    const y    = H - padB - barH;

    const rect = svgEl("rect", {
      x: x + 2, y, width: bw - 4, height: barH,
      fill: color, rx: "3", opacity: "0.82",
      "aria-label": `Score ~${binCenter.toFixed(1)}: ${count} entries`,
    });
    rect.style.transition = "opacity 0.15s, filter 0.15s";
    rect.addEventListener("mouseenter", () => {
      rect.setAttribute("opacity", "1");
      rect.style.filter = "brightness(1.1)";
    });
    rect.addEventListener("mouseleave", () => {
      rect.setAttribute("opacity", "0.82");
      rect.style.filter = "";
    });

    // Tooltip
    const title = document.createElementNS(ns, "title");
    title.textContent = `${count} entr${count === 1 ? "y" : "ies"} in range [${(binCenter - 0.1).toFixed(1)}, ${(binCenter + 0.1).toFixed(1)}]`;
    rect.appendChild(title);
    svg.appendChild(rect);

    // Count label on bar
    if (barH > 14) {
      svg.appendChild(svgEl("text", {
        x: x + bw / 2, y: y - 3,
        "text-anchor": "middle", "font-size": "8.5",
        fill: "currentColor", opacity: "0.65", "font-family": "var(--mono)",
      }, String(count)));
    }
  });

  // Mean indicator line + label
  const meanX = padL + ((meanSc + 1) / 2) * (W - padL - padR);
  svg.appendChild(svgEl("line", {
    x1: meanX, y1: padT, x2: meanX, y2: H - padB,
    stroke: "var(--accent)", "stroke-width": "1.5", "stroke-dasharray": "5 3",
  }));
  svg.appendChild(svgEl("text", {
    x: meanX + 3, y: padT + 9,
    "font-size": "7.5", fill: "var(--accent)", "font-family": "var(--mono)",
  }, `avg ${meanSc >= 0 ? "+" : ""}${meanSc.toFixed(2)}`));

  // X-axis numeric labels
  [[-1, "\u22121"], [-0.5, "\u22120.5"], [0.5, "+0.5"], [1, "+1"]].forEach(([v, label]) => {
    const x = padL + ((v + 1) / 2) * (W - padL - padR);
    svg.appendChild(svgEl("text", {
      x, y: H - 13,
      "text-anchor": "middle", "font-size": "8.5",
      fill: "currentColor", opacity: "0.42", "font-family": "var(--mono)",
    }, label));
  });

  // Zone annotations below numeric labels
  [
    [padL + (W - padL - padR) * 0.12, "negative", "var(--negative)"],
    [padL + (W - padL - padR) * 0.88, "positive", "var(--positive)"],
  ].forEach(([x, zone, color]) => {
    svg.appendChild(svgEl("text", {
      x, y: H - 3,
      "text-anchor": "middle", "font-size": "7",
      fill: color, opacity: "0.55", "font-family": "var(--mono)",
    }, zone));
  });
}

// ========== Confidence Chart (improved) ==========
// Per-sentiment: avg bar with individual entry dots overlaid
// as a strip plot — shows spread, not just the average.
function renderConfidenceChart(items) {
  const container = $("#conf-bars");
  const labels    = ["positive", "neutral", "negative"];

  const confByLabel = { positive: [], neutral: [], negative: [] };
  items.forEach((i) => {
    if (confByLabel[i.sentiment]) confByLabel[i.sentiment].push(i.confidence || 0);
  });

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  container.innerHTML = labels.map((k) => {
    const arr   = confByLabel[k];
    const mean  = avg(arr);
    const pct   = Math.round(mean * 100);
    const cnt   = arr.length;
    const color = `var(--${k === "positive" ? "positive" : k === "negative" ? "negative" : "neutral"})`;

    // Individual dots — clamped to [0, 100%] left position
    const dots = arr.map((v) => {
      const left = Math.max(0, Math.min(100, v * 100)).toFixed(1);
      return `<span class="conf-dot" style="left:${left}%;background:${color}" title="${Math.round(v*100)}% confidence"></span>`;
    }).join("");

    // Low/high spread info
    const minV = arr.length ? Math.min(...arr) : 0;
    const maxV = arr.length ? Math.max(...arr) : 0;
    const spread = arr.length > 1
      ? `<span class="conf-spread">${Math.round(minV*100)}% \u2013 ${Math.round(maxV*100)}%</span>`
      : "";

    return `
      <div class="conf-row-v2">
        <div class="conf-row-v2__head">
          <span class="conf-label-v2" style="color:${color}">${k}</span>
          <span class="conf-count-badge">${cnt}&nbsp;entr${cnt === 1 ? "y" : "ies"}</span>
          <span class="conf-avg-badge" style="color:${color}">${pct}%&nbsp;avg</span>
          ${spread}
        </div>
        <div class="conf-track-v2"
             role="progressbar"
             aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
             aria-label="${k} average confidence ${pct}%">
          <div class="conf-fill-v2" style="width:${pct}%;background:${color}20"></div>
          <div class="conf-fill-v2 conf-fill-v2--bar" style="width:${pct}%;background:${color}"></div>
          <div class="conf-dots-strip">${dots}</div>
        </div>
        <div class="conf-range-labels">
          <span class="conf-range-lbl">0%</span>
          <span class="conf-range-lbl">50%</span>
          <span class="conf-range-lbl">100%</span>
        </div>
      </div>`;
  }).join("");
}

// ========== Sentiment Momentum Chart ==========
// Replaces the plain sparkline with a proper analytical chart:
// • Shaded positive/negative fill zones
// • Rolling 3-entry average line (amber)
// • Individual coloured dots per entry with hover tooltips
// • Y axis: +1 / 0 / -1 with grid lines; X axis: entry numbers
function renderMomentumChart(items) {
  const svg = $("#timeline-svg");
  const W = 900, H = 120, padL = 34, padR = 14, padT = 14, padB = 28;
  const n = items.length;
  const ns = "http://www.w3.org/2000/svg";

  svg.innerHTML = `<title id="timeline-title">Sentiment score timeline</title>`;
  if (n < 2) return;

  const svgEl = (tag, attrs, text) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xScale = (i) => padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
  const yScale = (v) => padT + ((1 - (v + 1) / 2)) * plotH;
  const zy     = yScale(0);

  // Defs: gradients + clipPaths
  const defs = svgEl("defs", {});
  defs.innerHTML = `
    <linearGradient id="tl-pos-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--positive)" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="var(--positive)" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="tl-neg-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--negative)" stop-opacity="0"/>
      <stop offset="100%" stop-color="var(--negative)" stop-opacity="0.2"/>
    </linearGradient>
    <clipPath id="clip-above"><rect x="${padL}" y="${padT}" width="${plotW}" height="${Math.max(0, zy - padT)}"/></clipPath>
    <clipPath id="clip-below"><rect x="${padL}" y="${zy}" width="${plotW}" height="${Math.max(0, padT + plotH - zy)}"/></clipPath>`;
  svg.appendChild(defs);

  // Y-axis grid lines + labels
  [[-1, "\u22121"], [0, "0"], [1, "+1"]].forEach(([v, lbl]) => {
    const y = yScale(v);
    svg.appendChild(svgEl("line", {
      x1: padL, y1: y, x2: W - padR, y2: y,
      stroke: "currentColor",
      "stroke-opacity": v === 0 ? "0.18" : "0.07",
      "stroke-dasharray": "4 4", "stroke-width": "1",
    }));
    svg.appendChild(svgEl("text", {
      x: padL - 5, y: y + 3.5,
      "text-anchor": "end", "font-size": "8.5",
      fill: "currentColor", opacity: "0.42", "font-family": "var(--mono)",
    }, lbl));
  });

  // Zone labels (right edge)
  svg.appendChild(svgEl("text", {
    x: W - padR - 2, y: padT + 9,
    "text-anchor": "end", "font-size": "7.5",
    fill: "var(--positive)", opacity: "0.55", "font-family": "var(--mono)",
  }, "positive"));
  svg.appendChild(svgEl("text", {
    x: W - padR - 2, y: H - padB - 2,
    "text-anchor": "end", "font-size": "7.5",
    fill: "var(--negative)", opacity: "0.55", "font-family": "var(--mono)",
  }, "negative"));

  // Rolling average (window = min(3, n))
  const WINDOW = Math.min(3, n);
  const rollingAvg = items.map((_, i) => {
    const slice = items.slice(Math.max(0, i - WINDOW + 1), i + 1);
    return slice.reduce((a, b) => a + b.score, 0) / slice.length;
  });

  const avgPts = rollingAvg.map((v, i) => [xScale(i), yScale(v)]);
  const lineD  = "M " + avgPts.map(([x, y]) => `${x},${y}`).join(" L ");

  // Area fill above zero
  const areaD = `M ${avgPts[0][0]},${zy} ` +
    avgPts.map(([x, y]) => `L ${x},${y}`).join(" ") +
    ` L ${avgPts[avgPts.length-1][0]},${zy} Z`;
  svg.appendChild(svgEl("path", { d: areaD, fill: "url(#tl-pos-grad)", "clip-path": "url(#clip-above)" }));
  svg.appendChild(svgEl("path", { d: areaD, fill: "url(#tl-neg-grad)", "clip-path": "url(#clip-below)" }));

  // Rolling average line
  svg.appendChild(svgEl("path", {
    d: lineD, fill: "none",
    stroke: "var(--accent)", "stroke-width": "1.8",
    "stroke-linejoin": "round", "stroke-linecap": "round",
  }));

  // "3-pt avg" label at last point
  const last = avgPts[avgPts.length - 1];
  svg.appendChild(svgEl("text", {
    x: last[0] + 5, y: last[1] + 3.5,
    "font-size": "7.5", fill: "var(--accent)",
    "font-family": "var(--mono)", opacity: "0.85",
  }, "3-pt avg"));

  // Individual score dots
  const baseR = n > 20 ? 3 : 4;
  items.forEach((item, i) => {
    const x = xScale(i);
    const y = yScale(item.score);

    const dot = svgEl("circle", {
      cx: x, cy: y, r: String(baseR),
      fill: getCssVar(item.sentiment),
      stroke: "var(--card)", "stroke-width": "1.5",
    });

    const title = document.createElementNS(ns, "title");
    title.textContent = `#${i + 1}: ${item.sentiment} (${item.score >= 0 ? "+" : ""}${Number(item.score).toFixed(2)})`;
    dot.appendChild(title);

    dot.setAttribute("aria-label", `Entry ${i + 1}: ${item.sentiment}, score ${item.score.toFixed(2)}`);
    dot.style.cursor = "default";
    dot.style.transition = "r 0.12s";
    dot.addEventListener("mouseenter", () => dot.setAttribute("r", baseR + 2));
    dot.addEventListener("mouseleave", () => dot.setAttribute("r", baseR));

    svg.appendChild(dot);
  });

  // X-axis entry labels
  const step = Math.max(1, Math.ceil(n / 8));
  const shown = new Set();
  for (let i = 0; i < n; i += step) {
    shown.add(i);
    svg.appendChild(svgEl("text", {
      x: xScale(i), y: H - 8,
      "text-anchor": "middle", "font-size": "8.5",
      fill: "currentColor", opacity: "0.35", "font-family": "var(--mono)",
    }, String(i + 1)));
  }
  // Always show last
  if (!shown.has(n - 1)) {
    svg.appendChild(svgEl("text", {
      x: xScale(n - 1), y: H - 8,
      "text-anchor": "middle", "font-size": "8.5",
      fill: "currentColor", opacity: "0.35", "font-family": "var(--mono)",
    }, String(n)));
  }
}

// ========== Themes ==========
function renderThemes(themes) {
  const list    = $("#themes");
  const maxMent = Math.max(1, ...themes.map((t) => t.mentions || 0));

  list.innerHTML = themes.map((t) => {
    const pct = ((t.mentions || 0) / maxMent) * 100;
    return `
      <li class="theme-item">
        <div>
          <div class="theme-name">${esc(t.label)}</div>
          <div class="theme-bar-track"
               role="progressbar"
               aria-valuenow="${t.mentions || 0}" aria-valuemax="${maxMent}"
               aria-label="${t.label}: ${t.mentions} mentions">
            <div class="theme-bar-fill" style="width:${pct}%;background:${getCssVar(t.sentiment)}"></div>
          </div>
        </div>
        <span class="theme-count">${t.mentions ?? 0}</span>
      </li>`;
  }).join("");
}

// ========== Emotion cloud ==========
function renderEmotionCloud(items) {
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
    return `<span class="emotion-chip ${cls}" title="${count} mention${count !== 1 ? "s" : ""}">${esc(word)}</span>`;
  }).join("");
}

// ========== Per-entry items ==========
function renderItems(items) {
  const list = $("#items");

  list.innerHTML = items.map((item) => {
    const arrow = item.sentiment === "positive" ? "\u2197" : item.sentiment === "negative" ? "\u2198" : "\u2192";
    const emotions = (item.emotions || []).length
      ? `<div class="tags">${item.emotions.map((e) => `<span class="tag">${esc(e)}</span>`).join("")}</div>`
      : "";
    const phrases = (item.keyPhrases || []).length
      ? `<p class="item-phrases">"${item.keyPhrases.slice(0, 3).map(esc).join(" \u00B7 ")}"</p>`
      : "";

    return `
      <li class="item-entry" data-sentiment="${item.sentiment}">
        <div>
          <div class="item-head">
            <span class="sentiment-arrow" style="color:${getCssVar(item.sentiment)}" aria-hidden="true">${arrow}</span>
            <span class="pill" style="color:${getCssVar(item.sentiment)}">${item.sentiment}</span>
            <span class="score-badge">${Number(item.score).toFixed(2)} \u00B7 ${Math.round((item.confidence || 0) * 100)}% conf</span>
          </div>
          <p class="item-text">${esc(item.text)}</p>
        </div>
        <div class="item-meta">${emotions}${phrases}</div>
      </li>`;
  }).join("");

  // Filter buttons
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

function getCssVar(sentimentKey) {
  const map = {
    positive: "var(--positive)",
    neutral:  "var(--neutral)",
    negative: "var(--negative)",
  };
  return map[sentimentKey] || "var(--muted)";
}