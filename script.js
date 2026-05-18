/* =========================================================
   Sentic — script.js
   Improved: better histogram, confidence chart, momentum
   chart, and 25-entry realistic sample datasets.
   Fixed: PDF export height calculations (no lineHeightFactor)
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

// Export PDF — disabled until analysis completes
const exportBtn = document.getElementById("exportPdf");
if (exportBtn) {
  exportBtn.disabled = true;
  exportBtn.addEventListener("click", async function() {
    if (!window._senticLastData || this.disabled) return;
    await exportPdf(window._senticLastData, this);
  });
}

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
  if (exportBtn) exportBtn.disabled = true;
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
  if (window._setPdfData) window._setPdfData(d);
  if (exportBtn) exportBtn.disabled = false;

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

  // Horizontal grid lines
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

    const title = document.createElementNS(ns, "title");
    title.textContent = `${count} entr${count === 1 ? "y" : "ies"} in range [${(binCenter - 0.1).toFixed(1)}, ${(binCenter + 0.1).toFixed(1)}]`;
    rect.appendChild(title);
    svg.appendChild(rect);

    if (barH > 14) {
      svg.appendChild(svgEl("text", {
        x: x + bw / 2, y: y - 3,
        "text-anchor": "middle", "font-size": "8.5",
        fill: "currentColor", opacity: "0.65", "font-family": "var(--mono)",
      }, String(count)));
    }
  });

  // Mean indicator
  const meanX = padL + ((meanSc + 1) / 2) * (W - padL - padR);
  svg.appendChild(svgEl("line", {
    x1: meanX, y1: padT, x2: meanX, y2: H - padB,
    stroke: "var(--accent)", "stroke-width": "1.5", "stroke-dasharray": "5 3",
  }));
  svg.appendChild(svgEl("text", {
    x: meanX + 3, y: padT + 9,
    "font-size": "7.5", fill: "var(--accent)", "font-family": "var(--mono)",
  }, `avg ${meanSc >= 0 ? "+" : ""}${meanSc.toFixed(2)}`));

  // X-axis labels
  [[-1, "\u22121"], [-0.5, "\u22120.5"], [0.5, "+0.5"], [1, "+1"]].forEach(([v, label]) => {
    const x = padL + ((v + 1) / 2) * (W - padL - padR);
    svg.appendChild(svgEl("text", {
      x, y: H - 13,
      "text-anchor": "middle", "font-size": "8.5",
      fill: "currentColor", opacity: "0.42", "font-family": "var(--mono)",
    }, label));
  });

  // Zone annotations
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

// ========== Confidence Chart ==========
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

    const dots = arr.map((v) => {
      const left = Math.max(0, Math.min(100, v * 100)).toFixed(1);
      return `<span class="conf-dot" style="left:${left}%;background:${color}" title="${Math.round(v*100)}% confidence"></span>`;
    }).join("");

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

  // Y-axis grid lines
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

  // Zone labels
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

  // Rolling average
  const WINDOW = Math.min(3, n);
  const rollingAvg = items.map((_, i) => {
    const slice = items.slice(Math.max(0, i - WINDOW + 1), i + 1);
    return slice.reduce((a, b) => a + b.score, 0) / slice.length;
  });

  const avgPts = rollingAvg.map((v, i) => [xScale(i), yScale(v)]);
  const lineD  = "M " + avgPts.map(([x, y]) => `${x},${y}`).join(" L ");

  // Area fill
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

  // X-axis labels
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

// ========== PDF Export (FIXED - all boxes properly measured) ==========
window._setPdfData = function(d) { window._senticLastData = d; };

async function exportPdf(d, btn) {
  if (!window.jspdf) return toast("PDF library not loaded yet.", true);
  const { jsPDF } = window.jspdf;

  const origHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spin"></span> Generating…`;

  await new Promise(r => setTimeout(r, 60));

  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const PW = doc.internal.pageSize.getWidth();   // 595.28
    const PH = doc.internal.pageSize.getHeight();  // 841.89
    const ML = 48;
    const MR = 48;
    const CW = PW - ML - MR;

    // Palette
    const C = {
      paper:    [250, 247, 240],
      ink:      [24,  22,  18],
      muted:    [120, 114,  98],
      rule:     [218, 211, 196],
      accent:   [212, 134,  30],
      positive: [ 38, 120,  74],
      neutral:  [130, 120,  94],
      negative: [178,  52,  32],
      card:     [255, 253, 248],
      header:   [ 24,  22,  18],
      white:    [255, 255, 255],
    };
    const sentRgb = s => ({ positive: C.positive, neutral: C.neutral, negative: C.negative }[s] || C.muted);

    // Line heights per font size (pt) - consistent, no lineHeightFactor
    const getLineHeight = (fontSize) => Math.max(12, fontSize * 1.4);
    
    const HEADER_H    = 72;
    const FOOTER_H    = 40;
    const PAGE_TOP    = HEADER_H + 28;
    const CONT_TOP    = 44;
    const SAFE_BOTTOM = PH - FOOTER_H - 16;
    const SECTION_GAP = 28;
    const PARA_GAP    = 10;

    let y       = PAGE_TOP;
    let pageNum = 1;

    const font = (style, size, color) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setCharSpace(0);
      if (color) doc.setTextColor(...color);
    };

    const pageBg = () => {
      doc.setFillColor(...C.paper);
      doc.rect(0, 0, PW, PH, "F");
    };

    const hRule = (yy, x1 = ML, x2 = PW - MR, w = 0.5, color = C.rule) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(w);
      doc.line(x1, yy, x2, yy);
    };

    const textHeight = (text, maxW, size) => {
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text ?? ""), maxW);
      return lines.length * getLineHeight(size);
    };

    const drawText = (text, x, yy, maxW, size, style, color, align = "left") => {
      font(style, size, color);
      const lines = doc.splitTextToSize(String(text ?? ""), maxW);
      const lh = getLineHeight(size);
      lines.forEach((ln, i) => doc.text(ln, x, yy + i * lh, { align }));
      return yy + lines.length * lh;
    };

    const need = pts => { if (y + pts > SAFE_BOTTOM) addPage(); };

    const drawPageHeader = () => {
      doc.setFillColor(...C.header);
      doc.rect(0, 0, PW, HEADER_H, "F");
      doc.setFillColor(...C.accent);
      doc.rect(0, HEADER_H - 3, PW, 3, "F");
    };

    const drawPageFooter = () => {
      doc.setFillColor(...C.paper);
      doc.rect(0, PH - FOOTER_H, PW, FOOTER_H, "F");
      hRule(PH - FOOTER_H + 1, 0, PW, 0.5, C.rule);
      font("normal", 7.5, C.muted);
      doc.text("Sentic — Sentiment Analysis Report", ML, PH - 14);
      doc.text(`Page ${pageNum}`, PW - MR, PH - 14, { align: "right" });
      if (pageNum === 1) {
        doc.text(dateStr, PW / 2, PH - 14, { align: "center" });
      }
    };

    const addPage = () => {
      drawPageFooter();
      doc.addPage();
      pageNum++;
      pageBg();
      doc.setFillColor(...C.header);
      doc.rect(0, 0, PW, 28, "F");
      doc.setFillColor(...C.accent);
      doc.rect(0, 25, PW, 3, "F");
      font("normal", 7.5, [200, 195, 185]);
      doc.text("Sentic — Sentiment Analysis Report", ML, 18);
      y = CONT_TOP;
    };

    const sectionHead = (label, extraY = 0) => {
      y += extraY;
      need(32);
      hRule(y, ML, PW - MR, 0.5, C.rule);
      y += 14;
      font("bold", 7, C.muted);
      doc.setCharSpace(2.0);
      doc.text(label.toUpperCase(), ML, y);
      doc.setCharSpace(0);
      y += 14;
    };

    const bar = (x, yy, w, pct, color, h = 8) => {
      doc.setFillColor(...C.rule);
      doc.roundedRect(x, yy, w, h, 2, 2, "F");
      const fill = w * Math.min(Math.max(pct, 0), 1);
      if (fill > 2) {
        doc.setFillColor(...color);
        doc.roundedRect(x, yy, fill, h, 2, 2, "F");
      }
    };

    const sentPill = (label, x, yy) => {
      const col = sentRgb(label);
      const bg  = col.map(v => Math.min(255, v + 148));
      font("bold", 7.5, col);
      const tw = doc.getTextWidth(label.toUpperCase()) + 14;
      doc.setFillColor(...bg);
      doc.roundedRect(x, yy - 8, tw, 12, 3, 3, "F");
      doc.text(label.toUpperCase(), x + 7, yy + 1);
      return tw;
    };

    const kpiCard = (label, value, x, yy, w, h, valColor) => {
      doc.setFillColor(...C.card);
      doc.roundedRect(x, yy, w, h, 5, 5, "F");
      doc.setDrawColor(...C.rule);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, yy, w, h, 5, 5, "S");
      doc.setFillColor(...C.accent);
      doc.roundedRect(x, yy, w, 4, 2, 2, "F");
      doc.rect(x, yy + 2, w, 2, "F");
      font("bold", 6.5, C.muted);
      doc.setCharSpace(1.2);
      const llines = doc.splitTextToSize(label.toUpperCase(), w - 16);
      doc.text(llines, x + 8, yy + 17);
      doc.setCharSpace(0);
      let vs = 18;
      font("bold", vs, valColor || C.ink);
      while (doc.getTextWidth(String(value)) > w - 16 && vs > 9) {
        vs -= 0.5;
        doc.setFontSize(vs);
      }
      doc.text(String(value), x + 8, yy + h - 12);
    };

    // Pre-compute
    const counts = { positive: 0, neutral: 0, negative: 0 };
    d.items.forEach(it => { counts[it.sentiment] = (counts[it.sentiment] || 0) + 1; });
    const total   = d.items.length || 1;
    const avgConf = Math.round(d.items.reduce((s, it) => s + (it.confidence || 0), 0) / total * 100);
    const posRate = Math.round((counts.positive / total) * 100);
    const domSent = d.overall?.dominantSentiment || "neutral";
    const avgScore = Number(d.overall?.averageScore ?? 0);
    const now     = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    // ================================================================
    // PAGE 1
    // ================================================================
    pageBg();
    drawPageHeader();

    let faviconDataUrl = null;
    await new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        try {
          const cv = document.createElement("canvas");
          cv.width = cv.height = 64;
          cv.getContext("2d").drawImage(img, 0, 0, 64, 64);
          faviconDataUrl = cv.toDataURL("image/png");
        } catch(e) {}
        resolve();
      };
      img.onerror = () => resolve();
      img.crossOrigin = "anonymous";
      img.src = "/favicon.ico";
    });

    const LOGO_SIZE = 38;
    const LOGO_Y    = (HEADER_H - LOGO_SIZE) / 2 - 2;

    if (faviconDataUrl) {
      doc.addImage(faviconDataUrl, "PNG", ML, LOGO_Y, LOGO_SIZE, LOGO_SIZE);
    } else {
      doc.setFillColor(...C.accent);
      doc.roundedRect(ML, LOGO_Y, LOGO_SIZE, LOGO_SIZE, 6, 6, "F");
      font("bold", 22, C.header);
      doc.text("S", ML + 11, LOGO_Y + 26);
    }

    const textX = ML + LOGO_SIZE + 14;
    font("bold", 20, C.white);
    doc.text("Sentic", textX, LOGO_Y + 16);
    font("normal", 9, [190, 185, 172]);
    doc.text("Sentiment Analysis Report", textX, LOGO_Y + 30);

    font("normal", 8.5, [190, 185, 172]);
    doc.text("Generated " + dateStr, PW - MR, LOGO_Y + 16, { align: "right" });
    font("normal", 8, [150, 145, 132]);
    doc.text(`${total} entr${total === 1 ? "y" : "ies"} analysed`, PW - MR, LOGO_Y + 30, { align: "right" });

    // Executive Summary box
    const summaryText = d.overall?.summary || "";
    const SUMMARY_FS  = 10;
    const SUMMARY_LH  = getLineHeight(SUMMARY_FS);
    
    doc.setFontSize(SUMMARY_FS);
    const summaryLines = doc.splitTextToSize(summaryText, CW - 36);
    const SUMMARY_PAD_TOP    = 36;
    const SUMMARY_PAD_BOTTOM = 16;
    const summaryBoxH = Math.max(72, SUMMARY_PAD_TOP + summaryLines.length * SUMMARY_LH + SUMMARY_PAD_BOTTOM);

    need(summaryBoxH + 10);

    doc.setFillColor(...C.card);
    doc.roundedRect(ML, y, CW, summaryBoxH, 6, 6, "F");
    doc.setDrawColor(...C.rule);
    doc.setLineWidth(0.5);
    doc.roundedRect(ML, y, CW, summaryBoxH, 6, 6, "S");
    doc.setFillColor(...C.accent);
    doc.roundedRect(ML, y, 5, summaryBoxH, 3, 3, "F");
    doc.rect(ML + 2, y, 3, summaryBoxH, "F");

    font("bold", 7, C.muted);
    doc.setCharSpace(1.8);
    doc.text("EXECUTIVE SUMMARY", ML + 16, y + 17);
    doc.setCharSpace(0);

    font("italic", SUMMARY_FS, C.ink);
    let summaryY = y + SUMMARY_PAD_TOP;
    summaryLines.forEach(ln => {
      doc.text(ln, ML + 16, summaryY);
      summaryY += SUMMARY_LH;
    });

    y += summaryBoxH + SECTION_GAP;

    // KPI Cards
    need(72);
    const KPI_GAP  = 8;
    const KPI_COLS = 5;
    const kW       = (CW - KPI_GAP * (KPI_COLS - 1)) / KPI_COLS;
    const kH       = 64;

    const kpis = [
      { label: "Overall Sentiment", value: domSent,             color: sentRgb(domSent) },
      { label: "Average Score",     value: (avgScore >= 0 ? "+" : "") + avgScore.toFixed(2), color: C.ink },
      { label: "Total Entries",     value: String(total),       color: C.ink },
      { label: "Positive Rate",     value: posRate + "%",       color: C.positive },
      { label: "Avg Confidence",    value: avgConf + "%",       color: C.ink },
    ];
    kpis.forEach((k, i) => {
      kpiCard(k.label, k.value, ML + i * (kW + KPI_GAP), y, kW, kH, k.color);
    });
    y += kH + SECTION_GAP;

    // Sentiment Distribution
    sectionHead("Sentiment Distribution");
    const distBarW = CW - 130;
    ["positive", "neutral", "negative"].forEach(lbl => {
      need(26);
      const pct = counts[lbl] / total;
      const col = sentRgb(lbl);

      font("bold", 9, C.ink);
      doc.text(lbl.charAt(0).toUpperCase() + lbl.slice(1), ML, y + 6);

      bar(ML + 76, y - 1, distBarW, pct, col, 10);

      font("bold", 8.5, col);
      doc.text(
        `${counts[lbl]}  (${Math.round(pct * 100)}%)`,
        ML + 76 + distBarW + 10,
        y + 6
      );
      y += 24;
    });
    y += PARA_GAP;

    // Score Histogram
    sectionHead("Score Distribution  ( −1 to +1 )");
    need(90);

    const bands      = [-1, -0.6, -0.2, 0.2, 0.6, 1.01];
    const bandLabels = ["−1.0", "−0.6", "−0.2", "+0.2", "+0.6", "+1.0"];
    const buckets    = new Array(bands.length - 1).fill(0);
    d.items.forEach(item => {
      for (let b = 0; b < bands.length - 1; b++) {
        if (Number(item.score) >= bands[b] && Number(item.score) < bands[b + 1]) {
          buckets[b]++;
          break;
        }
      }
    });
    const maxBucket = Math.max(1, ...buckets);
    const histH     = 60;
    const slotW     = CW / buckets.length;

    hRule(y + histH + 1, ML, PW - MR, 0.5, C.rule);

    buckets.forEach((cnt, i) => {
      const bh  = Math.max(cnt > 0 ? 4 : 0, (cnt / maxBucket) * histH);
      const bx  = ML + i * slotW + 4;
      const bw  = slotW - 8;
      const mid = (bands[i] + bands[i + 1]) / 2;
      const col = mid < -0.15 ? C.negative : mid > 0.15 ? C.positive : C.neutral;

      doc.setFillColor(...col.map(v => Math.min(255, v + 100)));
      doc.roundedRect(bx, y, bw, histH, 3, 3, "F");
      if (bh > 0) {
        doc.setFillColor(...col);
        doc.roundedRect(bx, y + histH - bh, bw, bh, 3, 3, "F");
      }
      if (cnt > 0) {
        font("bold", 8, col);
        doc.text(String(cnt), bx + bw / 2, y + histH - bh - 5, { align: "center" });
      }
      font("normal", 6.5, C.muted);
      doc.text(bandLabels[i], bx + bw / 2, y + histH + 12, { align: "center" });
    });

    const meanX = ML + ((avgScore + 1) / 2) * CW;
    doc.setDrawColor(...C.accent);
    doc.setLineWidth(1.5);
    doc.line(meanX, y - 4, meanX, y + histH + 4);
    font("bold", 7, C.accent);
    const meanLabel  = `mean ${avgScore >= 0 ? "+" : ""}${avgScore.toFixed(2)}`;
    const meanLabelW = doc.getTextWidth(meanLabel);
    const meanLabelX = (meanX + 6 + meanLabelW > PW - MR) ? meanX - meanLabelW - 6 : meanX + 6;
    doc.text(meanLabel, meanLabelX, y + 10);

    y += histH + 24;

    // ================================================================
    // PAGE 2
    // ================================================================
    addPage();

    // Top Themes
    sectionHead("Top Themes", 0);
    const themes   = (d.themes || []).slice(0, 12);
    const maxMent  = Math.max(1, ...themes.map(t => t.mentions || 0));
    const RANK_W   = 28;
    const LABEL_W  = 175;
    const BAR_X    = ML + RANK_W + LABEL_W + 12;
    const BAR_W    = CW - RANK_W - LABEL_W - 60;
    const COUNT_X  = BAR_X + BAR_W + 10;

    themes.forEach((t, i) => {
      need(24);
      const col = sentRgb(t.sentiment);
      const pct = (t.mentions || 0) / maxMent;

      if (i % 2 === 0) {
        doc.setFillColor(244, 241, 233);
        doc.rect(ML, y - 10, CW, 22, "F");
      }

      font("bold", 8, C.muted);
      doc.text(String(i + 1).padStart(2, "0"), ML + 4, y + 4);

      doc.setFillColor(...col);
      doc.circle(ML + RANK_W - 4, y, 4, "F");

      font("bold", 9, C.ink);
      const lbl1 = doc.splitTextToSize(t.label || "", LABEL_W)[0];
      doc.text(lbl1, ML + RANK_W + 4, y + 4);

      bar(BAR_X, y - 3, BAR_W, pct, col, 9);

      font("bold", 8.5, col);
      doc.text(String(t.mentions || 0), COUNT_X, y + 4);

      y += 22;
    });

    y += PARA_GAP;

    // Emotion Breakdown
    sectionHead("Emotion Breakdown", 6);

    const freq = {};
    d.items.forEach(it => {
      (it.emotions || []).forEach(e => {
        const k = e.toLowerCase().trim();
        if (k) freq[k] = (freq[k] || 0) + 1;
      });
    });
    const sortedEmo = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 24);
    const maxFreq   = sortedEmo[0]?.[1] || 1;

    if (sortedEmo.length > 0) {
      const CHIP_H   = 18;
      const CHIP_GAP = 6;
      const ROW_GAP  = 8;

      let rows     = [];
      let curRow   = [];
      let curRowW  = 0;

      sortedEmo.forEach(([word, cnt]) => {
        const ratio = cnt / maxFreq;
        const fs    = ratio >= 0.7 ? 10 : ratio >= 0.4 ? 9 : 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fs);
        const chipW = doc.getTextWidth(word) + 16;
        if (curRowW + chipW > CW && curRow.length > 0) {
          rows.push(curRow);
          curRow  = [];
          curRowW = 0;
        }
        curRow.push({ word, cnt, ratio, fs, chipW });
        curRowW += chipW + CHIP_GAP;
      });
      if (curRow.length) rows.push(curRow);

      rows.forEach(row => {
        need(CHIP_H + ROW_GAP + 4);
        let cx = ML;
        row.forEach(({ word, ratio, fs, chipW }) => {
          const alpha = 0.18 + ratio * 0.55;
          const bg = C.accent.map((v, j) => Math.round(v * alpha + C.paper[j] * (1 - alpha)));
          doc.setFillColor(...bg);
          doc.roundedRect(cx, y - 2, chipW, CHIP_H, 4, 4, "F");
          font("normal", fs, C.ink);
          doc.text(word, cx + 8, y + CHIP_H - 7);
          cx += chipW + CHIP_GAP;
        });
        y += CHIP_H + ROW_GAP;
      });
    }

    y += PARA_GAP;

    // Key Insights (FIXED)
    sectionHead("Key Insights", 6);
    const INSIGHTS_FS = 9.5;
    const INSIGHTS_LH = getLineHeight(INSIGHTS_FS);
    const INSIGHTS_PAD = 12;

    (d.insights || []).forEach((ins, i) => {
      const insLines = doc.splitTextToSize(ins, CW - 32);
      const insH = INSIGHTS_PAD + insLines.length * INSIGHTS_LH;

      need(insH + 6);

      if (i % 2 === 0) {
        doc.setFillColor(244, 241, 233);
        doc.roundedRect(ML, y - 4, CW, insH, 3, 3, "F");
      }

      doc.setFillColor(...C.accent);
      doc.circle(ML + 10, y + 5, 9, "F");
      font("bold", 8, C.white);
      doc.text(String(i + 1), ML + 10, y + 8.5, { align: "center" });

      font("normal", INSIGHTS_FS, C.ink);
      let insY = y + 5;
      insLines.forEach(ln => {
        doc.text(ln, ML + 26, insY);
        insY += INSIGHTS_LH;
      });

      y += insH + 6;
    });

    y += PARA_GAP;

    // Recommendations (FIXED)
    sectionHead("Recommendations", 6);
    const RECS_FS = 9.5;
    const RECS_LH = getLineHeight(RECS_FS);
    const RECS_PAD = 12;

    (d.recommendations || []).forEach((rec, i) => {
      const recLines = doc.splitTextToSize(rec, CW - 32);
      const recH = RECS_PAD + recLines.length * RECS_LH;

      need(recH + 6);

      if (i % 2 === 0) {
        doc.setFillColor(242, 248, 244);
        doc.roundedRect(ML, y - 4, CW, recH, 3, 3, "F");
      }

      doc.setFillColor(...C.positive);
      doc.roundedRect(ML, y - 2, 16, 14, 3, 3, "F");
      font("bold", 9, C.white);
      doc.text("→", ML + 4, y + 9);

      font("normal", RECS_FS, C.ink);
      let recY = y + 5;
      recLines.forEach(ln => {
        doc.text(ln, ML + 24, recY);
        recY += RECS_LH;
      });

      y += recH + 6;
    });

    // ================================================================
    // PAGE 3+ · Per-Entry Breakdown (FIXED)
    // ================================================================
    addPage();
    sectionHead("Per-Entry Breakdown", 0);

    d.items.forEach((item, idx) => {
      // Text measurement
      const TEXT_FS = 9.5;
      const TEXT_LH = getLineHeight(TEXT_FS);
      doc.setFontSize(TEXT_FS);
      const rawTextLines = doc.splitTextToSize(item.text || "", CW - 32);
      const clipped = rawTextLines.slice(0, 5);
      if (rawTextLines.length > 5) clipped[4] = clipped[4].replace(/.{3}$/, "…");
      const textH = clipped.length * TEXT_LH;

      // Meta measurement
      const META_FS = 8;
      const META_LH = getLineHeight(META_FS);
      
      const emoArr = (item.emotions || []).slice(0, 6);
      doc.setFontSize(META_FS);
      const emoLines = emoArr.length > 0
        ? doc.splitTextToSize(emoArr.join("  ·  "), CW - 48)
        : [];
      
      const phrArr = (item.keyPhrases || []).slice(0, 4);
      doc.setFontSize(META_FS);
      const phrLines = phrArr.length > 0
        ? doc.splitTextToSize(phrArr.join("  ·  "), CW - 48)
        : [];

      const META_GAP = 8;
      const emoH = emoLines.length > 0 ? emoLines.length * META_LH + 8 : 0;
      const phrH = phrLines.length > 0 ? phrLines.length * META_LH + 8 : 0;
      const META_H = emoH + phrH;

      const CARD_PAD   = 14;
      const HEADER_HGT = 24;
      const cardH = CARD_PAD + HEADER_HGT + textH + META_H + CARD_PAD;

      need(cardH + 10);

      const cx = ML;
      const cy = y;

      // Card shell
      doc.setFillColor(...C.card);
      doc.roundedRect(cx, cy, CW, cardH, 5, 5, "F");
      doc.setDrawColor(...C.rule);
      doc.setLineWidth(0.5);
      doc.roundedRect(cx, cy, CW, cardH, 5, 5, "S");

      const sentCol = sentRgb(item.sentiment);
      doc.setFillColor(...sentCol);
      doc.roundedRect(cx, cy, 5, cardH, 3, 3, "F");
      doc.rect(cx + 2, cy, 3, cardH, "F");

      // Header row
      const hY = cy + CARD_PAD + 8;

      font("bold", 7.5, C.muted);
      doc.text(`#${idx + 1}`, cx + 14, hY);

      const pillX = cx + 34;
      const pillW = sentPill(item.sentiment, pillX, hY);

      const scoreVal = Number(item.score);
      font("bold", 8.5, sentCol);
      doc.text(
        `${scoreVal >= 0 ? "+" : ""}${scoreVal.toFixed(2)}`,
        pillX + pillW + 10,
        hY
      );

      const confStr = `${Math.round((item.confidence || 0) * 100)}% confidence`;
      font("normal", 7.5, C.muted);
      doc.text(confStr, cx + CW - 10, hY, { align: "right" });

      hRule(cy + CARD_PAD + 14, cx + 12, cx + CW - 12, 0.4, C.rule);

      // Entry text - draw each line explicitly
      const textY = cy + CARD_PAD + HEADER_HGT + 4;
      font("normal", TEXT_FS, C.ink);
      let curY = textY;
      clipped.forEach(ln => {
        doc.text(ln, cx + 14, curY);
        curY += TEXT_LH;
      });

      // Meta rows
      let metaY = textY + textH + 6;

      if (emoLines.length > 0) {
        font("bold", 7.5, C.muted);
        doc.text("Emotions", cx + 14, metaY);
        font("normal", META_FS, C.ink);
        let emoY = metaY;
        emoLines.forEach(ln => {
          doc.text(ln, cx + 60, emoY);
          emoY += META_LH;
        });
        metaY += emoLines.length * META_LH + 8;
      }

      if (phrLines.length > 0) {
        font("bold", 7.5, C.muted);
        doc.text("Key Phrases", cx + 14, metaY);
        font("italic", META_FS, C.muted);
        let phrY = metaY;
        phrLines.forEach(ln => {
          doc.text(ln, cx + 72, phrY);
          phrY += META_LH;
        });
      }

      y += cardH + 8;
    });

    drawPageFooter();

    const slug = dateStr.replace(/\s+/g, "-").toLowerCase();
    doc.save(`sentic-report-${slug}.pdf`);
    toast("PDF exported!", false);

  } catch (err) {
    console.error("PDF export error:", err);
    toast("Export failed: " + err.message, true);
  } finally {
    btn.disabled  = false;
    btn.innerHTML = origHTML;
  }
}